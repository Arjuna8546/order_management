from celery import shared_task
import imaplib
import email
import re
from .models import Order
from django.conf import settings
from email.header import decode_header

@shared_task
def check_incoming_emails():
    mail = imaplib.IMAP4_SSL('imap.gmail.com')
    mail.login("arjunvv447@gmail.com", "amtu nwob dnyg nccq")
    mail.select("inbox")

    status, messages = mail.search(None, 'UNSEEN')

    for num in messages[0].split():
        _, data = mail.fetch(num, "(RFC822)")
        raw_email = data[0][1]
        msg = email.message_from_bytes(raw_email)

        if msg.get("In-Reply-To") or msg.get("References"):
            subject, encoding = decode_header(msg["Subject"])[0]
            if isinstance(subject, bytes):
                subject = subject.decode(encoding or "utf-8")

            body = ""
            if msg.is_multipart():
                for part in msg.walk():
                    if part.get_content_type() == "text/plain" and not part.get("Content-Disposition"):
                        body = part.get_payload(decode=True).decode()
                        break
            else:
                body = msg.get_payload(decode=True).decode()

            reply_lines = body.strip().splitlines()
            reply_content = []
            for line in reply_lines:
                if line.strip().startswith("On ") and "wrote:" in line:
                    break
                reply_content.append(line.strip())
            clean_reply = "\n".join(filter(None, reply_content)).strip()

            print("\n New Reply Received")
            print(f"Subject: {subject}")
            print("Reply Content:\n", clean_reply)
            print("-" * 60)

    mail.logout()