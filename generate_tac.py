import sys
import re

def generate_tac(cpp_file):
    tac_code = []
    with open(cpp_file, "r") as f:
        lines = f.readlines()

    temp_var = 0
    for line in lines:
        line = line.strip()
        
        # Match matrix multiplication pattern (A[i][j] += B[i][k] * C[k][j])
        match = re.match(r'(\w+)\[(\w+)\]\[(\w+)\] \+= (\w+)\[(\w+)\]\[(\w+)\] \* (\w+)\[(\w+)\]\[(\w+)\]', line)
        if match:
            A, i, j, B, i2, k, C, k2, j2 = match.groups()
            
            if i == i2 and k == k2 and j == j2:  # Validate indices
                t1 = f"t{temp_var} = {B}[{i}][{k}] * {C}[{k}][{j}]"
                temp_var += 1
                t2 = f"{A}[{i}][{j}] = {A}[{i}][{j}] + t{temp_var-1}"
                tac_code.extend([t1, t2])

    return "\n".join(tac_code)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_tac.py <cpp_file>")
        sys.exit(1)

    cpp_file = sys.argv[1]
    tac_output = generate_tac(cpp_file)
    
    with open("tac_output.txt", "w") as f:
        f.write(tac_output)

    print(tac_output)
