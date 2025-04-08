from flask import Flask, render_template, request, jsonify, redirect

from abc import ABCMeta, abstractmethod

app = Flask(__name__)

class Combo:
    # CONCRETE COMBO CLASS

    allCombos = {}

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
    def InputText(self) -> str:
        return self._inputText
    @InputText.setter
    def Keys(self,inputText:str):
        self._inputText = "".join(set(inputText.replace(" ","").lower()))

    @property
    def OutputText(self) -> str:
        return self._outputText
    @OutputText.setter
    def Keys(self,outputText:str):
        self._outputText = outputText

class IBuilder(metaclass=ABCMeta):
    # BUILDER INTERFACE

    @staticmethod
    @abstractmethod
    def getResult():
        pass

class ComboBuilder(IBuilder):
    # CONSTRUCTS COMBO

    def __init__(self):
        self.product = Combo(None,None,None,None)

    def buildID(self,inputID:int) -> 'ComboBuilder':
        self.product.Id = inputID
        return self
    
    def buildKeys(self,inputKeys:dict) -> 'ComboBuilder':
        self.product.Keys = inputKeys
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
    def constructCombo(id:int,keys:dict,inputText:str,outputText:str) -> Combo:
        return ComboBuilder()\
            .buildID(id)\
            .buildKeys(keys)\
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
            "leftControl":data["data"]["leftControl"],
            "leftShift":data["data"]["leftShift"],
            "leftAlt":data["data"]["leftAlt"],

            "rightControl":data["data"]["rightControl"],
            "rightShift":data["data"]["rightShift"],
            "rightAlt":data["data"]["rightAlt"]
        },
        data["data"]["inputText"],
        data["data"]["outputText"]
    )
    Combo.allCombos[data["data"]["id"]] = newCombo
    return jsonify(True)

if __name__ == "__main__":
    app.run()