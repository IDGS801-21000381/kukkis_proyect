from flask import Flask,render_template,request
from flask import flash, redirect, url_for
from flask_wtf.csrf import CSRFProtect
from config.config import DevelopmentConfig
from flask import g
import forms.forms as forms
ordenes = []
from wtforms import validators
from flask import request
from datetime import datetime
from sqlalchemy import func


app=Flask(__name__)
app.config.from_object(DevelopmentConfig)
csrf=CSRFProtect()
 
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'),404
 
@app.before_request
def before_request():
    print("before 1")
   
@app.after_request
def after_request(response):
    print("after 3")
    return response
 
@app.route("/")
def calor():
        return render_template("base.html")

@app.route('/admin/index')
def admin_index():
    return render_template('admin/index.html')
  
if __name__== "__main__":
    csrf.init_app(app)
   # db.init_app(app)
    

    with app.app_context():
     #    db.create_all()
       app.run()