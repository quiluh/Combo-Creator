from flask import Flask, render_template, request, jsonify, redirect

from abc import ABCMeta, abstractmethod

app = Flask(__name__)

# TODO: create a builder interface and then a combo builder

class Combo:
    # CONCRETE COMBO CLASS

    def __init__(self,id:int,keys:dict,inputText:str,outputText:str):
        self._id = id
        self._keys = keys
        # SAVE INPUT TEXT AS A STRING WITH NO DUPLICATES, UPPERCASE OR WHITESPACE
        self._inputText = "".join(set(inputText.replace(" ","").lower()))
        self._outputText = outputText

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
        self._inputText = inputText

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
        self.product = Combo()
        #id:int,keys:dict,inputText:str,outputText:str

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