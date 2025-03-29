import sys
from collections import defaultdict

def analyze_tac(tac_file):
    op_counts = defaultdict(int)
    with open(tac_file, 'r') as f:
        for line in f:
            if '=' in line:
                rhs = line.split('=')[1].strip()
                if ' ' in rhs:
                    op = rhs.split(' ')[1].strip()
                    op_counts[op] += 1
    return op_counts

def generate_lut(op_counts):
    lut = {
        'add': 'ADD',
        'sub': 'SUB',
        'mul': 'MUL',
        'load': 'LD',
        'store': 'ST'
    }
    
    lut_output = []
    lut_output.append("Operation Frequency:")
    for op, count in op_counts.items():
        lut_output.append(f"{op}: {count}")

    lut_output.append("\nLookup Table:")
    for llvm_op, isa_op in lut.items():
        lut_output.append(f"{llvm_op.ljust(15)} -> {isa_op}")

    return "\n".join(lut_output)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_lut.py <tac_file>")
        sys.exit(1)
    
    op_counts = analyze_tac(sys.argv[1])
    lut_output = generate_lut(op_counts)

    with open("lut_output.txt", "w") as f:
        f.write(lut_output)

    print(lut_output)
