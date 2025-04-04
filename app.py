from flask import Flask, render_template, request, jsonify, redirect

import json

app = Flask(__name__)

@app.route("/index")
def Index():
    return render_template("index.html")

@app.route("/")
def PortHome():
    return redirect("/index")

@app.route("/processImplementation",methods=["POST"])
def ProcessImplementation():
    data = request.get_json()
    return jsonify(True)

if __name__ == "__main__":
    app.run()