from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fuzzywuzzy import fuzz  # Fuzzy matching for keyword detection

from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from pathlib import Path

# Initialize FastAPI
app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

# AI Configuration
llm = ChatOllama(model="gemma2")
embeddings = OllamaEmbeddings(model="rimuru")
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a compassionate and supportive assistant trained in cognitive behavioral therapy (CBT) techniques. Always respond in a positive, encouraging way and offer helpful strategies to manage thoughts, feelings, and behaviors."),
    ("human", "{input}")
])
chain: Runnable = prompt | llm

# FAISS Vector Store Setup
FAISS_DB_PATH = "chat_faiss_index"

if Path(f"{FAISS_DB_PATH}/index.faiss").exists():
    db = FAISS.load_local(FAISS_DB_PATH, embeddings, allow_dangerous_deserialization=True)
else:
    dummy_doc = [Document(page_content="Initial message")]
    db = FAISS.from_documents(dummy_doc, embeddings)
    db.save_local(FAISS_DB_PATH)

# Pydantic Models
class ChatRequest(BaseModel):
    messages: list[dict[str, str]]

class ChatResponse(BaseModel):
    response: str

# CBT Keywords List
cbt_keywords = [
    "anxiety", "stress", "depression", "thought", "emotion", "feeling", "coping",
    "mindfulness", "panic", "self-esteem", "negative thinking",
    "cognitive", "behavior", "mood", "worry", "cbt", "therapy", "journaling",
    "therapist", "psychologist", "mental health", "trauma", "triggers",
    "hopeless", "self-worth", "confidence", "resilience", "healing",
    "meditation", "breathing exercise", "affirmations", "self-care",
    "intrusive thoughts", "inner critic", "rumination", "distorted thoughts",
    "emotional regulation", "panic attack", "grounding techniques", "stress relief",
    "self-talk", "positive mindset", "gratitude journal", "emotional intelligence",
    "coping strategies", "thought record", "exposure therapy", "phobia", "fear",
    "relaxation", "distress tolerance", "self-harm prevention", "journaling prompts",
    "anxiety", "stress", "depression", "thought", "emotion", "feeling", "coping",
    "mindfulness", "panic", "self-esteem", "self talk", "negative thinking",
    "cognitive", "behavior", "mood", "worry", "cbt", "therapy", "journaling",
    "cbt", "cognitive", "behavior", "therapy", "therapist", "psychologist", "mental health",
    "emotions", "feelings", "thoughts", "behaviors", "stress", "anxiety", "depression",
    "panic", "phobia", "fear", "worry", "rumination", "overthinking", "negative thinking",
    "distorted thoughts", "automatic thoughts", "self-esteem", "self-worth", "confidence",
    "self-image", "self-concept", "self-perception", "mood", "irritability", "hopelessness",
    "helplessness", "motivation", "goal", "mindfulness", "meditation", "breathe", "relaxation",
    "coping", "coping skills", "coping strategies", "journaling", "thought record",
    "mood tracker", "emotion regulation", "grounding", "acceptance", "validation", "support",
    "support system", "friend", "loneliness", "relationship", "assertiveness", "boundaries",
    "problem solving", "goal setting", "habit", "routine", "change", "challenge", "resilience",
    "resilient", "progress", "hope", "growth", "positive thinking", "gratitude", "values",
    "self-care", "wellness", "burnout", "trauma", "triggers", "flashback", "avoidance",
    "exposure", "acceptance and commitment", "ACT", "DBT", "distress tolerance", "emotional pain",
    "emotional support", "social support", "motivate", "encourage", "comfort", "compassion",
    "kindness", "judgment", "criticism", "blame", "guilt", "shame", "regret", "pain", "suffering",
    "challenge your thoughts", "dispute thoughts", "catastrophizing", "black and white thinking",
    "all or nothing", "should statements", "personalization", "labeling", "mind reading",
    "fortune telling", "overgeneralization", "minimization", "magnification", "emotional reasoning",
    "cognitive distortion", "core belief", "schema", "internal dialogue", "inner critic",
    "self talk", "negative self talk", "positive self talk", "affirmation", "mantra", "visualization",
    "exposure therapy", "systematic desensitization", "behavioral activation", "trigger",
    "safety behavior", "avoidant", "maladaptive", "adaptive", "accept", "acknowledge", "reframe",
    "challenge belief", "alternative thought", "balanced thought", "functional thinking",
    "thought restructuring", "perspective", "reflection", "growth mindset", "strength", "vulnerability",
    "breakdown", "crisis", "emotion chart", "safety plan", "emergency", "insomnia", "sleep hygiene",
    "fatigue", "energy", "hopeless", "helpless", "worthless", "not good enough", "failure", "useless",
    "burden", "focus", "attention", "distraction", "compulsion", "obsession", "intrusive thoughts",
    "avoid", "cope", "reassurance", "reassurance seeking", "social anxiety", "isolation",
    "lonely", "connected", "belonging", "identity", "purpose", "meaning", "future", "past",
    "present", "awareness", "check-in", "emotional check-in", "stress relief", "de-stress",
    "calm down", "soothe", "anchor", "managing emotions", "emotional intelligence", "insight",
    "introspection", "processing", "express", "vent", "talk", "listen", "understand", "empathy",
    "validation", "unhelpful thought", "balanced thinking", "mental filter", "bias", "filtering",
    "labels", "narrative", "journaling prompts", "self-reflection", "mind-body", "nervous system",
    "fight or flight", "freeze", "emotional brain", "rational mind", "wise mind", "self-harm",
    "self-destructive", "urge", "craving", "obsessive thoughts", "impulse control", "anger",
    "frustration", "resentment", "irritated", "overwhelmed", "tired", "exhausted", "numb",
    "stuck", "pressure", "expectations", "perfectionism", "comparison", "shame spiral",
    "inner child", "compassionate self", "healing", "trauma response", "hypervigilance",
    "flashbacks", "body scan", "relaxation exercise", "deep breathing", "belly breathing",
    "box breathing", "counting breath", "grounding techniques", "5-4-3-2-1 technique",
    "safe place", "emotional anchor", "meditative", "visual imagery", "walking", "movement",
    "exercise", "sunlight", "hydration", "nutrition", "journaling routine", "mood diary",
    "emotion log", "thought challenge worksheet", "belief log", "emotion scale",
    "positive behavior", "well-being", "hopeful", "future plan", "meaningful goals",
    "intrinsic motivation", "external motivation", "reinforcement", "reward", "habit tracker",
    "accountability", "therapeutic homework", "session", "psychoeducation", "self-monitoring",
    "relapse prevention", "anchor phrase", "calming thought", "coping card", "therapy note"
]

# Function to check if the input is CBT-related
def is_cbt_topic(text: str) -> bool:
    text = text.lower()
    for keyword in cbt_keywords:
        if keyword in text or fuzz.partial_ratio(keyword, text) > 85:  # Fuzzy matching
            return True
    return False

# Routes
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/status")
async def status():
    try:
        # Test the model connection
        test_response = chain.invoke({"input": "Hello"})
        return {"status": "connected", "model": "gemma2"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Get the last message from the conversation
        last_message = request.messages[-1]["content"]
        
        # CBT Keyword Filtering
        if not is_cbt_topic(last_message):
            return JSONResponse(content={
                "response": "I'm here to assist with CBT-related topics. Please ask about mental well-being, emotions, or cognitive behavioral therapy techniques."
            })

        # Store message
        new_doc = Document(page_content=last_message)
        db.add_documents([new_doc])
        db.save_local(FAISS_DB_PATH)

        # Retrieve similar documents for context
        similar_docs = db.similarity_search(last_message, k=3)
        context = "\n".join(doc.page_content for doc in similar_docs)

        # Generate response with contextual help
        full_input = f"User message: {last_message}\n\nHelpful context:\n{context}"
        response = chain.invoke({"input": full_input})
        
        return JSONResponse(content={"response": response.content})
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Error processing chat request: {str(e)}"}
        )
