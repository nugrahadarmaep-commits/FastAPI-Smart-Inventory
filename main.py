from fastapi import FastAPI, Depends, HTTPException, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from src.db import supabase
from src.auth import hash_password, verify_password, create_access_token, get_current_user

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.post("/register")
def register(username: str = Form(...), password: str = Form(...)):
    hashed = hash_password(password)
    check = supabase.table("users").select("*").eq("username", username).execute()
    if check.data: raise HTTPException(400, "Username udah ada!")
    supabase.table("users").insert({"username": username, "password": hashed}).execute()
    return {"message": "Daftar sukses!"}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_query = supabase.table("users").select("*").eq("username", form_data.username).execute()
    if not user_query.data or not verify_password(form_data.password, user_query.data[0]["password"]):
        raise HTTPException(400, "User/Pass salah!")
    return {"access_token": create_access_token({"sub": form_data.username}), "token_type": "bearer"}

@app.get("/items")
def get_items(current_user: str = Depends(get_current_user)):
    return supabase.table("items").select("*").execute().data

@app.post("/items")
def create_item(name: str = Form(...), qty: int = Form(...), price: int = Form(...), current_user: str = Depends(get_current_user)):
    res = supabase.table("items").insert({"name": name, "qty": qty, "price": price}).execute()
    return {"message": "Barang ditambah!", "data": res.data}

@app.delete("/items/{item_id}")
def delete_item(item_id: int, current_user: str = Depends(get_current_user)):
    supabase.table("items").delete().eq("id", item_id).execute()
    return {"message": "Dihapus!"}
  
@app.put("/items/{item_id}")
def update_item(item_id: int, name: str = Form(...), qty: int = Form(...), price: int = Form(...), current_user: str = Depends(get_current_user)):
    res = supabase.table("items").update({
        "name": name, 
        "qty": qty, 
        "price": price
    }).eq("id", item_id).execute()
    return {"message": "Data inventaris berhasil diperbarui.", "data": res.data}

@app.delete("/users/me")
def delete_account(current_user: str = Depends(get_current_user)):
    supabase.table("users").delete().eq("username", current_user).execute()
    return {"message": "Akun pengguna berhasil dihapus dari sistem."}

@app.get("/", response_class=HTMLResponse)
def index_ui(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")