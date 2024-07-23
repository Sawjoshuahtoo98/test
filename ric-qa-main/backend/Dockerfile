FROM debian:bookworm-slim

RUN apt update
RUN apt install -y python3 python3-pip python3-venv

WORKDIR /opt/ric-qa/backend

COPY requirements.txt .
RUN python3 -m venv .venv
RUN . .venv/bin/activate && pip install -r requirements.txt

COPY . .

# cleanup
RUN apt autoremove -y
RUN apt clean
RUN rm -rf /var/lib/apt/lists/*

USER nobody
CMD [".venv/bin/gunicorn", "-b", "0.0.0.0:8080", "wsgi:app"]

