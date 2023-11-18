from flask import Flask, render_template, request, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__, template_folder='./')
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin()
def home():
    response = make_response(render_template("index.html"))
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run(debug=True)