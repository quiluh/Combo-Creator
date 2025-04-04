from flask import Flask, render_template, request, jsonify, redirect

import json

app = Flask(__name__)

@app.route("/index")
def Index():
    return render_template("index.html")

@app.route("/")
def PortHome():
    return redirect("/index")

if __name__ == "__main__":
    app.run()