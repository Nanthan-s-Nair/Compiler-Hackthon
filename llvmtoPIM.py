import re

# Read LLVM IR

with open("matrix.ll", "r") as file:

    llvm_ir = file.readlines()

# pPIM ISA translation function

def translate_to_pPIM(llvm_ir):

    pPIM_code = ["PROG 10 000000 0000000000"]  # Start with PROG instruction

    for line in llvm_ir:

        if "mul" in line:

            pPIM_code.append("EXE 01 000001 0000000000")  # Example pPIM format for MUL

        elif "add" in line:

            pPIM_code.append("EXE 01 000010 0000000000")  # Example pPIM format for ADD

        elif "load" in line:

            pPIM_code.append("EXE 01 000011 0000000000") # Example pPIM format for LOAD

        elif "store" in line:

            pPIM_code.append("EXE 01 000100 0000000000") # Example pPIM format for STORE

    pPIM_code.append("END 00 000000 0000000000")  # End with END instruction

    return "\n".join(pPIM_code)

# Convert LLVM IR to pPIM ISA

pPIM_code = translate_to_pPIM(llvm_ir)

# Save output

with open("output_pPIM.isa", "w") as file:

    file.write(pPIM_code)

print("pPIM ISA Generated! Check output_pPIM.isa")
