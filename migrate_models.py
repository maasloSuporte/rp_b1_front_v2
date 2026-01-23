#!/usr/bin/env python3
"""
Script para migrar modelos TypeScript do Angular para React
Copia todos os arquivos .ts de models do projeto Angular para o React
"""

import os
import shutil
from pathlib import Path

# Caminhos
ANGULAR_MODELS = Path(r"C:\BEANS\rp_b1_front\src\app\DWA\shared\models")
REACT_MODELS = Path(r"C:\BEANS\rp_b1_front_react\src\types\models")

def migrate_models():
    """Migra todos os arquivos de modelos do Angular para React"""
    
    if not ANGULAR_MODELS.exists():
        print(f"Erro: Diretório Angular não encontrado: {ANGULAR_MODELS}")
        return
    
    # Criar estrutura de diretórios no React
    REACT_MODELS.mkdir(parents=True, exist_ok=True)
    
    # Contar arquivos
    total_files = 0
    migrated_files = 0
    
    # Percorrer todos os arquivos .ts
    for root, dirs, files in os.walk(ANGULAR_MODELS):
        for file in files:
            if file.endswith('.ts'):
                total_files += 1
                src_path = Path(root) / file
                
                # Calcular caminho relativo
                rel_path = src_path.relative_to(ANGULAR_MODELS)
                dest_path = REACT_MODELS / rel_path
                
                # Criar diretórios necessários
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Ler e adaptar conteúdo
                try:
                    with open(src_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Adaptações básicas (se necessário)
                    # Por enquanto, apenas copia
                    
                    # Escrever no destino
                    with open(dest_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    migrated_files += 1
                    print(f"OK: {rel_path}")
                except Exception as e:
                    print(f"ERRO ao migrar {rel_path}: {e}")
    
    print(f"\nMigracao concluida: {migrated_files}/{total_files} arquivos migrados")

if __name__ == "__main__":
    migrate_models()
