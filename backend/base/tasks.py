import os
import re
import imaplib
import email
import google.generativeai as genai
from celery import shared_task
from django.conf import settings
from base.models import Order 

@shared_task
def check_incoming_emails():
    mail = imaplib.IMAP4_SSL('imap.gmail.com')
    mail.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
    mail.select('inbox')

    status, messages = mail.search(None, 'UNSEEN')
    for num in messages[0].split():
        _, data = mail.fetch(num, '(RFC822)')
        raw_email = data[0][1]
        msg = email.message_from_bytes(raw_email)

        subject = msg['subject']
        reply_text = ""

        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == 'text/plain':
                    reply_text = part.get_payload(decode=True).decode()
                    break
        else:
            reply_text = msg.get_payload(decode=True).decode()


        order_id = extract_order_id(subject)
        if order_id is None:
            print("No order ID found.")
            continue

        status = interpret_reply_with_gemini(subject, reply_text, os.getenv("GEMINI_API_KEY"))

        try:
            order = Order.objects.get(id=order_id)
            order.status = status
            order.save()
            print(f"Order {order_id} updated to status: {status}")
        except Order.DoesNotExist:
            print(f"Order with ID {order_id} not found.")

    mail.logout()

def extract_order_id(subject: str):
    match = re.search(r"Order\s+#?(\d+)", subject, re.IGNORECASE)
    return int(match.group(1)) if match else None

def interpret_reply_with_gemini(subject: str, reply: str, gemini_api_key: str) -> str:
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel("gemma-3n-e4b-it")

    prompt = f"""
    Subject: "{subject}"
    Reply: "{reply}"

    Based on the reply, determine the correct order status from:
    - open
    - confirm
    - ready to dispatch
    - deliver

    Respond with only one exact status.
    """

    try:
        response = model.generate_content(prompt)
        result = response.text.strip().lower()
        if result in ["open", "confirm", "ready to dispatch", "deliver"]:
            return result
    except Exception as e:
        print("Gemini API error:", e)

    return "open"
