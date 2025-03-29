import sys
from collections import defaultdict

def analyze_tac(tac_file):
    op_counts = defaultdict(int)
    instructions = []
    with open(tac_file, 'r') as f:
        for line in f:
            if '=' in line:
                rhs = line.split('=')[1].strip()
                if ' ' in rhs:
                    op = rhs.split(' ')[0].strip()
                    op_counts[op] += 1
                    instructions.append(op)
    return op_counts, instructions

def generate_pPIM_ISA(instructions):
    # Mapping LLVM IR ops to pPIM ISA
    lut = {
        'add': ('ADDR', '01', '000111'),
        'sub': ('ADDR', '01', '000111'),
        'mul': ('ADDR', '01', '000111'),
        'load': ('MEM', '01', '000011'),
        'store': ('MEM', '01', '000100'),
        'icmp': ('CMP', '01', '000101'),
        'br': ('CTRL', '01', '000110'),
        'getelementptr': ('ADDR', '01', '000111'),
        'sext': ('ADDR', '01', '000111'),
        'trunc': ('ADDR', '01', '000111'),
        'phi': ('CTRL', '01', '000110')
    }
    
    # Generate pPIM instructions
    output = []
    output.append("PROG 10 000000 0000000000")  # Program start marker
    
    for instr in instructions:
        if instr in lut:
            isa_op, opcode, func_code = lut[instr]
            output.append(f"{isa_op} {opcode} {func_code} 0000000000")
    
    return output

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_pPIM.py <tac_file>")
        sys.exit(1)
    
    tac_file = sys.argv[1]
    op_counts, instructions = analyze_tac(tac_file)
    
    # Print frequency report
    print("Operation Frequency:")
    for op, count in op_counts.items():
        print(f"{op}: {count}")
    
    # Generate pPIM ISA instructions
    pPIM_ISA = generate_pPIM_ISA(instructions)
    
    # Print the generated pPIM ISA instructions
    print("\npPIM ISA Output:")
    for line in pPIM_ISA:
        print(line)

if __name__ == "__main__":
    main()
