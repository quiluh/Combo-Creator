from flask import Flask, render_template, request, jsonify, redirect

app = Flask(__name__)

if __name__ == "__main__":
    app.run()