
# ============================================================================
# REQUIREMENTS (requirements.txt)
# ============================================================================
"""
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
alembic==1.12.1
redis==5.0.1
celery==5.3.4
stripe==7.7.0
boto3==1.29.7
websockets==12.0
"""

# ============================================================================
# 1. CONFIGURATION & DATABASE
# ============================================================================

from datetime import datetime, timedelta
from typing import Optional, List
from enum import Enum
import os
import asyncio 

from fastapi import FastAPI, Depends, HTTPException, status, WebSocket
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from jose import JWTError, jwt

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cloud_nexus.db")
SECRET_KEY = os.getenv("SECRET_KEY", "votre-cle-secrete-super-securisee")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ============================================================================
# 2. MODELS DE BASE DE DONNÉES
# ============================================================================

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relations
    servers = relationship("Server", back_populates="owner")
    crm_leads = relationship("CRMLead", back_populates="owner")
    cloud_files = relationship("CloudFile", back_populates="owner")
    hosting_orders = relationship("HostingOrder", back_populates="user")


class Server(Base):
    __tablename__ = "servers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)  # US-East-1, EU-West-1, etc.
    cpu_usage = Column(Float, default=0.0)
    memory_usage = Column(Float, default=0.0)
    memory_total = Column(Float, default=0.0)
    bandwidth_usage = Column(Float, default=0.0)
    uptime_percentage = Column(Float, default=99.99)
    status = Column(String, default="active")  # active, maintenance, error
    ip_address = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="servers")
    metrics = relationship("ServerMetric", back_populates="server")


class ServerMetric(Base):
    __tablename__ = "server_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(Integer, ForeignKey("servers.id"))
    cpu_usage = Column(Float)
    memory_usage = Column(Float)
    network_in = Column(Float)
    network_out = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    server = relationship("Server", back_populates="metrics")


class CRMLead(Base):
    __tablename__ = "crm_leads"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)
    contact_name = Column(String)
    email = Column(String)
    phone = Column(String, nullable=True)
    lead_score = Column(Integer, default=0)
    status = Column(String, default="new")  # new, contacted, qualified, proposal, closing, won, lost
    temperature = Column(String, default="cold")  # cold, warm, hot
    estimated_value = Column(Float, default=0.0)
    image_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="crm_leads")


class CloudFile(Base):
    __tablename__ = "cloud_files"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_type = Column(String)  # pdf, jpg, docx, etc.
    file_size = Column(Float)  # in MB
    storage_path = Column(String)
    folder = Column(String, default="Documents")
    thumbnail_url = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="cloud_files")


class HostingPlan(Base):
    __tablename__ = "hosting_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)  # Starter, Pro, Enterprise
    price = Column(Float)
    cpu_vcores = Column(Integer)
    ram_gb = Column(Integer)
    storage_gb = Column(Integer)
    bandwidth_tb = Column(Float)
    is_popular = Column(Boolean, default=False)


class HostingOrder(Base):
    __tablename__ = "hosting_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plan_id = Column(Integer, ForeignKey("hosting_plans.id"))
    domain_name = Column(String)
    datacenter_location = Column(String)
    ssl_enabled = Column(Boolean, default=True)
    total_amount = Column(Float)
    payment_status = Column(String, default="pending")  # pending, paid, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="hosting_orders")
    plan = relationship("HostingPlan")


class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    severity = Column(String)  # critical, warning, info
    status = Column(String, default="active")  # active, resolved
    server_id = Column(Integer, ForeignKey("servers.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class SiteTemplate(Base):
    __tablename__ = "site_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)  # Portfolio, E-commerce, SaaS, Blog
    description = Column(String)
    preview_image = Column(String)
    is_premium = Column(Boolean, default=False)


# Créer toutes les tables
Base.metadata.create_all(bind=engine)

# ============================================================================
# 3. SCHÉMAS PYDANTIC
# ============================================================================

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    avatar_url: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ServerResponse(BaseModel):
    id: int
    name: str
    location: str
    cpu_usage: float
    memory_usage: float
    memory_total: float
    uptime_percentage: float
    status: str
    ip_address: str
    
    class Config:
        from_attributes = True

class ServerMetricCreate(BaseModel):
    cpu_usage: float
    memory_usage: float
    network_in: float
    network_out: float

class CRMLeadCreate(BaseModel):
    company_name: str
    contact_name: str
    email: EmailStr
    phone: Optional[str] = None
    estimated_value: float = 0.0

class CRMLeadResponse(BaseModel):
    id: int
    company_name: str
    contact_name: str
    lead_score: int
    status: str
    temperature: str
    estimated_value: float
    image_url: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class CloudFileResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size: float
    folder: str
    thumbnail_url: Optional[str]
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

class HostingPlanResponse(BaseModel):
    id: int
    name: str
    price: float
    cpu_vcores: int
    ram_gb: int
    storage_gb: int
    bandwidth_tb: float
    is_popular: bool
    
    class Config:
        from_attributes = True

class HostingOrderCreate(BaseModel):
    plan_id: int
    domain_name: str
    datacenter_location: str
    ssl_enabled: bool = True

class AlertResponse(BaseModel):
    id: int
    title: str
    description: str
    severity: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    active_users: int
    avg_latency_ms: float
    total_servers: int
    active_alerts: int
    conversion_rate: float
    system_load: float

# ============================================================================
# 4. FONCTIONS UTILITAIRES
# ============================================================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# ============================================================================
# 5. APPLICATION FASTAPI
# ============================================================================

app = FastAPI(title="Cloud Nexus API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# 6. ROUTES D'AUTHENTIFICATION
# ============================================================================

@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ============================================================================
# 7. ROUTES DASHBOARD
# ============================================================================

@app.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return DashboardStats(
        active_users=12400,
        avg_latency_ms=42,
        total_servers=db.query(Server).filter(Server.owner_id == current_user.id).count(),
        active_alerts=db.query(Alert).filter(Alert.status == "active").count(),
        conversion_rate=75.0,
        system_load=28.0
    )

# ============================================================================
# 8. ROUTES SERVERS
# ============================================================================

@app.get("/servers", response_model=List[ServerResponse])
def get_servers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Server).filter(Server.owner_id == current_user.id).all()

@app.get("/servers/{server_id}", response_model=ServerResponse)
def get_server(
    server_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    server = db.query(Server).filter(
        Server.id == server_id,
        Server.owner_id == current_user.id
    ).first()
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    return server

@app.post("/servers/{server_id}/metrics")
def create_server_metric(
    server_id: int,
    metric: ServerMetricCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    server = db.query(Server).filter(
        Server.id == server_id,
        Server.owner_id == current_user.id
    ).first()
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    db_metric = ServerMetric(server_id=server_id, **metric.dict())
    db.add(db_metric)
    
    # Mettre à jour les métriques du serveur
    server.cpu_usage = metric.cpu_usage
    server.memory_usage = metric.memory_usage
    
    db.commit()
    return {"status": "success"}

@app.get("/servers/{server_id}/metrics")
def get_server_metrics(
    server_id: int,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    metrics = db.query(ServerMetric).filter(
        ServerMetric.server_id == server_id
    ).order_by(ServerMetric.timestamp.desc()).limit(limit).all()
    return metrics

# ============================================================================
# 9. ROUTES CRM
# ============================================================================

@app.get("/crm/leads", response_model=List[CRMLeadResponse])
def get_crm_leads(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(CRMLead).filter(CRMLead.owner_id == current_user.id)
    if status:
        query = query.filter(CRMLead.status == status)
    return query.all()

@app.post("/crm/leads", response_model=CRMLeadResponse)
def create_crm_lead(
    lead: CRMLeadCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_lead = CRMLead(**lead.dict(), owner_id=current_user.id)
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@app.patch("/crm/leads/{lead_id}")
def update_crm_lead(
    lead_id: int,
    status: Optional[str] = None,
    lead_score: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lead = db.query(CRMLead).filter(
        CRMLead.id == lead_id,
        CRMLead.owner_id == current_user.id
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    if status:
        lead.status = status
    if lead_score:
        lead.lead_score = lead_score
    
    db.commit()
    return {"status": "success"}

# ============================================================================
# 10. ROUTES CLOUD FILES
# ============================================================================

@app.get("/cloud/files", response_model=List[CloudFileResponse])
def get_cloud_files(
    folder: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(CloudFile).filter(CloudFile.owner_id == current_user.id)
    if folder:
        query = query.filter(CloudFile.folder == folder)
    return query.order_by(CloudFile.uploaded_at.desc()).all()

@app.get("/cloud/storage-stats")
def get_storage_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_size = db.query(CloudFile).filter(
        CloudFile.owner_id == current_user.id
    ).with_entities(db.func.sum(CloudFile.file_size)).scalar() or 0
    
    return {
        "used_gb": round(total_size / 1024, 2),
        "total_gb": 100,
        "percentage": round((total_size / 1024 / 100) * 100, 2)
    }

# ============================================================================
# 11. ROUTES HOSTING
# ============================================================================

@app.get("/hosting/plans", response_model=List[HostingPlanResponse])
def get_hosting_plans(db: Session = Depends(get_db)):
    return db.query(HostingPlan).all()

@app.post("/hosting/orders")
def create_hosting_order(
    order: HostingOrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    plan = db.query(HostingPlan).filter(HostingPlan.id == order.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    # Calculer le total (plan + domaine + TVA)
    domain_price = 1.0
    subtotal = plan.price + domain_price
    vat = subtotal * 0.20
    total = subtotal + vat
    
    db_order = HostingOrder(
        user_id=current_user.id,
        plan_id=order.plan_id,
        domain_name=order.domain_name,
        datacenter_location=order.datacenter_location,
        ssl_enabled=order.ssl_enabled,
        total_amount=total
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    return {
        "order_id": db_order.id,
        "total_amount": total,
        "status": "pending"
    }

# ============================================================================
# 12. ROUTES ALERTS
# ============================================================================

@app.get("/alerts", response_model=List[AlertResponse])
def get_alerts(
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    if status:
        query = query.filter(Alert.status == status)
    return query.order_by(Alert.created_at.desc()).limit(10).all()

# ============================================================================
# 13. ROUTES TEMPLATES
# ============================================================================

@app.get("/templates")
def get_templates(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SiteTemplate)
    if category:
        query = query.filter(SiteTemplate.category == category)
    return query.all()

# ============================================================================
# 14. WEBSOCKET POUR TEMPS RÉEL
# ============================================================================

@app.websocket("/ws/metrics")
async def websocket_metrics(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Simuler l'envoi de métriques en temps réel
            import random
            data = {
                "cpu": random.uniform(20, 80),
                "memory": random.uniform(30, 70),
                "network_in": random.uniform(100, 500),
                "network_out": random.uniform(50, 200),
                "timestamp": datetime.utcnow().isoformat()
            }
            await websocket.send_json(data)
            await asyncio.sleep(2)
    except:
        pass

# ============================================================================
# 15. ROUTE RACINE
# ============================================================================

@app.get("/")
def read_root():
    return {
        "app": "Cloud Nexus API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }

