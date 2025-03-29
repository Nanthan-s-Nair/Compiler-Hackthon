import streamlit as st
import os
import subprocess

# Ensure temporary directory exists
TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)

def save_uploaded_file(uploaded_file):
    """Save the uploaded C++ file and return its path."""
    file_path = os.path.join(TEMP_DIR, uploaded_file.name)
    with open(file_path, "wb") as f:
        f.write(uploaded_file.read())
    return file_path

def run_subprocess(command):
    """Run a subprocess and return its output or error."""
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        return f"Error: {result.stderr.strip()}"
    return result.stdout.strip()

def process_cpp_file(uploaded_file):
    """Process the uploaded C++ file to generate TAC, LUT, and pPIM ISA."""
    cpp_file_path = save_uploaded_file(uploaded_file)
    
    # Generate Three Address Code (TAC)
    tac_code = run_subprocess(["python3", "generate_tac.py", cpp_file_path])
    
    # Save TAC output to a temporary file
    tac_file_path = os.path.join(TEMP_DIR, "tac_output.txt")
    with open(tac_file_path, "w") as f:
        f.write(tac_code)
    
    # Generate Lookup Table (LUT)
    lut_code = run_subprocess(["python3", "generate_lut.py", tac_file_path])
    
    # Generate pPIM ISA
    ppim_code = run_subprocess(["python3", "generate_pPIM.py", tac_file_path])

    return tac_code, lut_code, ppim_code

# Streamlit UI
st.title("Matrix Processing & pPIM ISA Generator")

uploaded_file = st.file_uploader("Upload C++ File", type=["cpp"])

if uploaded_file:
    st.success(f"Uploaded: {uploaded_file.name}")
    
    # Process file and display results
    tac_code, lut_code, ppim_code = process_cpp_file(uploaded_file)
    
    st.subheader("Three Address Code (TAC)")
    st.text_area("TAC Output", tac_code, height=200)
    
    st.subheader("Lookup Table (LUT)")
    st.text_area("LUT Output", lut_code, height=200)
    
    st.subheader("pPIM ISA Translation")
    st.text_area("pPIM ISA Output", ppim_code, height=200)

