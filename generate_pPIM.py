import sys

# Define mappings from TAC operations to pPIM ISA
INSTRUCTION_MAP = {
    'mul': 'MUL R1, R2, R3',  # Multiplication
    'add': 'ADD R4, R3, R5',  # Addition
    'store': 'ST R5, [C]',  # Store the result
    'load': 'LD R1, [A]',  # Load values from matrix
}

def translate_to_pPIM(tac_file):
    pPIM_instructions = [
        "PROG 10 000000 0000000000",  # Start program execution
        "EXE  01 000000 0000000000"   # Execute program
    ]

    with open(tac_file, 'r') as f:
        for line in f:
            parts = line.split()
            if len(parts) > 2:  # Ensure it's a valid TAC instruction
                if "=" in parts and "*" in line:
                    pPIM_instructions.append(INSTRUCTION_MAP['load'])  # Load A
                    pPIM_instructions.append(INSTRUCTION_MAP['load'])  # Load B
                    pPIM_instructions.append(INSTRUCTION_MAP['mul'])  # Multiply
                
                if "=" in parts and "+" in line:
                    pPIM_instructions.append(INSTRUCTION_MAP['add'])  # Add
                
                if "C[" in line:  # Store result in C matrix
                    pPIM_instructions.append(INSTRUCTION_MAP['store'])  # Store result

    pPIM_instructions.append("END  11 111111 0000000000")  # End program execution
    return "\n".join(pPIM_instructions)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_pPIM.py <tac_file>")
        sys.exit(1)

    tac_file = sys.argv[1]
    pPIM_output = translate_to_pPIM(tac_file)

    with open("ppim_output.txt", "w") as f:
        f.write(pPIM_output)

    print(pPIM_output)

