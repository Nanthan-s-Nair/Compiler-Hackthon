'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Grid, Code, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

export default function Home() {
  const [matrixASize, setMatrixASize] = useState({ rows: 3, cols: 3 });
  const [matrixBSize, setMatrixBSize] = useState({ rows: 3, cols: 2 });
  const [matrixA, setMatrixA] = useState(Array(3).fill(Array(3).fill(0)));
  const [matrixB, setMatrixB] = useState(Array(3).fill(Array(2).fill(0)));
  const [result, setResult] = useState<number[][]>([]);
  const [isaCode, setIsaCode] = useState<string>('');
  const [activeStep, setActiveStep] = useState(0);

  const initializeMatrix = (rows: number, cols: number) => {
    return Array(rows).fill(0).map(() => Array(cols).fill(0));
  };

  const handleSetMatrices = () => {
    setMatrixA(initializeMatrix(matrixASize.rows, matrixASize.cols));
    setMatrixB(initializeMatrix(matrixBSize.rows, matrixBSize.cols));
    setResult([]);
    setIsaCode('');
    setActiveStep(1);
  };

  const updateMatrix = (matrix: number[][], setMatrix: (matrix: number[][]) => void, row: number, col: number, value: string) => {
    const newMatrix = matrix.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? Number(value) || 0 : c))
    );
    setMatrix(newMatrix);
  };

  const generateISACode = (matrixA: number[][], matrixB: number[][], result: number[][]) => {
    let code = '// Generated PIM ISA Instructions:\n';
    code += '// Programming cores\n';
    for (let i = 0; i < 4; i++) {
      code += `0x${(i * 0x10000).toString(16).padStart(6, '0')} // PROG core ${i} as multiplier\n`;
    }
    for (let i = 4; i < 9; i++) {
      code += `0x${(i * 0x10000).toString(16).padStart(6, '0')} // PROG core ${i} as adder\n`;
    }

    let memoryRow = 0;
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[0].length; j++) {
        code += `\n// Computing result[${i}][${j}]\n`;
        for (let k = 0; k < matrixA[0].length; k++) {
          code += `0x${(0x104000 + i * 256 + k).toString(16)} // LOAD A[${i}][${k}] from memory row ${i * matrixA[0].length + k}\n`;
          code += `0x${(0x114000 + k * 256 + j).toString(16)} // LOAD B[${k}][${j}] from memory row ${64 + k * matrixB[0].length + j}\n`;
          code += '0x200000 // EXE MAC operation\n';
        }
        code += `0x${(0x308000 + memoryRow).toString(16)} // STORE result[${i}][${j}] to memory row ${128 + memoryRow}\n`;
        memoryRow++;
      }
    }

    code += '\n0x800000 // END instruction';
    return code;
  };

  const multiplyMatrices = () => {
    if (matrixASize.cols !== matrixBSize.rows) {
      alert('Invalid matrix dimensions for multiplication');
      return;
    }

    const newResult = Array(matrixASize.rows).fill(0)
      .map(() => Array(matrixBSize.cols).fill(0));

    for (let i = 0; i < matrixASize.rows; i++) {
      for (let j = 0; j < matrixBSize.cols; j++) {
        for (let k = 0; k < matrixASize.cols; k++) {
          newResult[i][j] += matrixA[i][k] * matrixB[k][j];
        }
      }
    }

    setResult(newResult);
    setIsaCode(generateISACode(matrixA, matrixB, newResult));
    setActiveStep(2);
  };

  const MatrixCell = ({ value, onChange, isResult = false }: { value: number, onChange?: (value: string) => void, isResult?: boolean }) => {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative ${isResult ? 'bg-white/20' : 'bg-white/10'} rounded-lg p-2 aspect-square flex items-center justify-center transition-colors hover:bg-white/30`}
      >
        {isResult ? (
          <span className="text-lg font-semibold text-white">{value}</span>
        ) : (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="h-full text-center bg-transparent border-none text-white focus:ring-purple-400"
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <Calculator className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Matrix Multiplication & ISA Generator
          </h1>
        </motion.div>

        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Card className="bg-black/30 backdrop-blur-xl border-white/10 p-6 rounded-xl">
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Grid className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-semibold text-white">Matrix A Size</h2>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Input
                      type="number"
                      value={matrixASize.rows}
                      onChange={(e) => setMatrixASize({ ...matrixASize, rows: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-20 bg-white/10 border-white/20 text-white"
                    />
                    <X className="w-4 h-4 text-purple-400" />
                    <Input
                      type="number"
                      value={matrixASize.cols}
                      onChange={(e) => setMatrixASize({ ...matrixASize, cols: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-20 bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Grid className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-semibold text-white">Matrix B Size</h2>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Input
                      type="number"
                      value={matrixBSize.rows}
                      onChange={(e) => setMatrixBSize({ ...matrixBSize, rows: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-20 bg-white/10 border-white/20 text-white"
                    />
                    <X className="w-4 h-4 text-purple-400" />
                    <Input
                      type="number"
                      value={matrixBSize.cols}
                      onChange={(e) => setMatrixBSize({ ...matrixBSize, cols: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-20 bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSetMatrices}
                className="w-full bg-purple-500 hover:bg-purple-600 transition-colors text-white"
              >
                Initialize Matrices
              </Button>
            </Card>
          </motion.div>

          <AnimatePresence>
            {activeStep >= 1 && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Card className="bg-black/30 backdrop-blur-xl border-white/10 p-6 rounded-xl">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                        <Grid className="w-5 h-5 text-purple-400" />
                        Matrix A
                      </h2>
                      <motion.div 
                        variants={containerVariants}
                        className="grid gap-2"
                        style={{ gridTemplateColumns: `repeat(${matrixASize.cols}, 1fr)` }}
                      >
                        {matrixA.map((row, i) =>
                          row.map((cell, j) => (
                            <MatrixCell
                              key={`a-${i}-${j}`}
                              value={cell}
                              onChange={(value) => updateMatrix(matrixA, setMatrixA, i, j, value)}
                            />
                          ))
                        )}
                      </motion.div>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                        <Grid className="w-5 h-5 text-purple-400" />
                        Matrix B
                      </h2>
                      <motion.div 
                        variants={containerVariants}
                        className="grid gap-2"
                        style={{ gridTemplateColumns: `repeat(${matrixBSize.cols}, 1fr)` }}
                      >
                        {matrixB.map((row, i) =>
                          row.map((cell, j) => (
                            <MatrixCell
                              key={`b-${i}-${j}`}
                              value={cell}
                              onChange={(value) => updateMatrix(matrixB, setMatrixB, i, j, value)}
                            />
                          ))
                        )}
                      </motion.div>
                    </div>
                  </div>

                  <Button 
                    onClick={multiplyMatrices}
                    className="w-full mt-8 bg-purple-500 hover:bg-purple-600 transition-colors text-white"
                  >
                    Calculate
                  </Button>
                </Card>
              </motion.div>
            )}

            {activeStep >= 2 && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Card className="bg-black/30 backdrop-blur-xl border-white/10 p-6 rounded-xl">
                  <Tabs defaultValue="result" className="w-full">
                    <TabsList className="w-full mb-6 bg-white/10">
                      <TabsTrigger value="result" className="text-white data-[state=active]:bg-purple-500">Result Matrix</TabsTrigger>
                      <TabsTrigger value="isa" className="text-white data-[state=active]:bg-purple-500">ISA Code</TabsTrigger>
                    </TabsList>
                    <TabsContent value="result">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                          <Calculator className="w-5 h-5 text-purple-400" />
                          Result Matrix
                        </h2>
                        <motion.div 
                          variants={containerVariants}
                          className="grid gap-2 max-w-md mx-auto"
                          style={{ gridTemplateColumns: `repeat(${result[0]?.length || 1}, 1fr)` }}
                        >
                          {result.map((row, i) =>
                            row.map((cell, j) => (
                              <MatrixCell
                                key={`r-${i}-${j}`}
                                value={cell}
                                isResult={true}
                              />
                            ))
                          )}
                        </motion.div>
                      </div>
                    </TabsContent>
                    <TabsContent value="isa">
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                          <Code className="w-5 h-5 text-purple-400" />
                          Generated ISA Code
                        </h2>
                        <motion.pre
                          variants={itemVariants} 
                          className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-purple-200"
                        >
                          {isaCode}
                        </motion.pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}