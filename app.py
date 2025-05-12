from flask import Flask, render_template, request, jsonify, redirect

import threading

import keyboard

import time

import random

from abc import ABCMeta, abstractmethod

app = Flask(__name__)

class Combo:
    # CONCRETE COMBO CLASS

    allCombos = {}

    def __init__(self):
        self._id = 0
        self._keys = {}
        self._isImplemented = False
        self._inputText = ""
        self._outputText = ""

        self.stopEvent = threading.Event()
        self._thread = None

    @property
    def Id(self) -> int:
        return self._id
    @Id.setter
    def Id(self,inputId:int):
        self._id = inputId
    
    @property
    def Keys(self) -> dict:
        return self._keys
    @Keys.setter
    def Keys(self,inputKeys:dict):
        self._keys = inputKeys

    @property
    def IsImplemented(self) -> bool:
        return self._isImplemented
    @IsImplemented.setter
    def IsImplemented(self,inputIsImplemented:bool):
        self._isImplemented = inputIsImplemented

    @property
    def InputText(self) -> str:
        return self._inputText
    @InputText.setter
    def InputText(self,inputText:str):
        self._inputText = list(inputText.replace(" ","").lower())

    @property
    def OutputText(self) -> str:
        return self._outputText
    @OutputText.setter
    def OutputText(self,outputText:str):
        self._outputText = outputText

    @property
    def Thread(self) -> threading.Thread:
        return self._thread
    @Thread.setter
    def Thread(self,inputThread:threading.Thread):
        self._thread = inputThread

    def logicLoop(self):
        keys = self.Keys + self.InputText
        while not self.stopEvent.is_set():
            print(all([keyboard.is_pressed(i) for i in keys]))
            if all([keyboard.is_pressed(i) for i in keys]):
                for char in self.OutputText:
                    keyboard.write(char)
                    time.sleep(random.uniform(0.05,1))

    def startThread(self):
        print(f"Starting {self.Id}")
        self.stopEvent.clear()
        self.Thread = threading.Thread(target=self.logicLoop)
        self.Thread.start()

    def stopThread(self):
        print(f"Stopping {self.Id}")
        self.stopEvent.set()

class IBuilder(metaclass=ABCMeta):
    # BUILDER INTERFACE

    @staticmethod
    @abstractmethod
    def getResult():
        pass

class ComboBuilder(IBuilder):
    # CONSTRUCTS COMBO

    def __init__(self):
        self.product = Combo()

    def buildID(self,inputID:int) -> 'ComboBuilder':
        self.product.Id = inputID
        return self
    
    def buildKeys(self,inputKeys:dict) -> 'ComboBuilder':
        self.product.Keys = [i for i in inputKeys if inputKeys[i]]
        return self
    
    def buildIsImplemented(self,inputIsImplemented:bool) -> 'ComboBuilder':
        self.product.IsImplemented = inputIsImplemented
        return self
    
    def buildInputText(self,inputText:str) -> 'ComboBuilder':
        self.product.InputText = inputText
        return self
    
    def buildOutputText(self,outputText:str) -> 'ComboBuilder':
        self.product.OutputText = outputText
        return self
    
    def getResult(self) -> Combo:
        return self.product
    
class Director:
    # BUILD DIRECTOR

    @staticmethod
    def constructCombo(id:int,keys:dict,isImplemented:bool,inputText:str,outputText:str) -> Combo:
        return ComboBuilder()\
            .buildID(id)\
            .buildKeys(keys)\
            .buildIsImplemented(isImplemented)\
            .buildInputText(inputText)\
            .buildOutputText(outputText)\
            .getResult()

@app.route("/index")
def Index():
    return render_template("index.html")

@app.route("/")
def PortHome():
    return redirect("/index")

@app.route("/processImplementation",methods=["POST"])
def ProcessImplementation():
    data = request.get_json()
    newCombo = Director.constructCombo(
        data["data"]["id"],
        {
            "left control":data["data"]["leftControl"],
            "left shift":data["data"]["leftShift"],
            "left alt":data["data"]["leftAlt"],

            "right ctrl":data["data"]["rightControl"],
            "right shift":data["data"]["rightShift"],
            "right alt":data["data"]["rightAlt"]
        },
        data["data"]["implemented"],
        data["data"]["inputText"],
        data["data"]["outputText"]
    )
    Combo.allCombos[data["data"]["id"]] = newCombo
    if data["data"]["implemented"]:
        newCombo.startThread()
    else:
        newCombo.stopThread()
    return jsonify(True)

if __name__ == "__main__":

    app.run()