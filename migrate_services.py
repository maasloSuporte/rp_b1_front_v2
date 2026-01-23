#!/usr/bin/env python3
"""
Script para migrar serviços do Angular para React
Converte serviços Angular (@Injectable) para funções React
"""

import os
import re
from pathlib import Path

ANGULAR_SERVICES = Path(r"C:\BEANS\rp_b1_front\src\app\DWA\shared\services")
REACT_SERVICES = Path(r"C:\BEANS\rp_b1_front_react\src\services")

def convert_service_to_react(content: str, service_name: str) -> str:
    """Converte um serviço Angular para React"""
    
    # Remove imports do Angular
    content = re.sub(r'import\s+.*@angular.*?;\n', '', content)
    content = re.sub(r'import\s+.*Injectable.*?;\n', '', content)
    content = re.sub(r'import\s+.*Observable.*?;\n', '', content)
    content = re.sub(r'import\s+.*HttpClient.*?;\n', '', content)
    
    # Remove decorator @Injectable
    content = re.sub(r'@Injectable\s*\([^)]*\)\s*\n', '', content)
    
    # Remove classe e construtor
    class_match = re.search(r'export class (\w+)\s*\{[^}]*constructor\s*\([^)]*\)\s*\{[^}]*\}', content, re.DOTALL)
    if class_match:
        class_name = class_match.group(1)
        # Substitui por export const
        content = re.sub(
            r'export class ' + class_name + r'[^}]*constructor\s*\([^)]*\)\s*\{[^}]*\}',
            f'export const {service_name.lower().replace("service", "")}Service = {{',
            content,
            flags=re.DOTALL
        )
    
    # Converte métodos Observable para async/await
    content = re.sub(
        r'(\w+)\s*\([^)]*\):\s*Observable<([^>]+)>\s*\{[^}]*return\s+this\.http\.(get|post|patch|put|delete)<([^>]+)>\(`([^`]+)`([^)]*)\)[^}]*\}',
        r'\1: async (\2): Promise<\4> => {\n    const response = await api.\3<\4>(`\5`\6);\n    return response.data;\n  },',
        content,
        flags=re.DOTALL
    )
    
    # Adiciona import do api
    if 'import api' not in content:
        content = "import api from './api';\n" + content
    
    # Adiciona imports de tipos
    if 'from' in content and 'types' not in content:
        # Tenta adicionar imports de tipos
        pass
    
    # Fecha o objeto
    if not content.strip().endswith('};'):
        content = content.rstrip() + '\n};'
    
    return content

def migrate_services():
    """Migra todos os serviços"""
    
    if not ANGULAR_SERVICES.exists():
        print(f"Erro: Diretório Angular não encontrado: {ANGULAR_SERVICES}")
        return
    
    REACT_SERVICES.mkdir(parents=True, exist_ok=True)
    
    # Lista de serviços já migrados manualmente
    migrated = ['users.service.ts', 'roles.service.ts', 'companyUser.service.ts', 
                'userRole.service.ts', 'login.service.ts', 'auth.service.ts',
                'assets.service.ts', 'packages.service.ts', 'notification.service.ts']
    
    total_files = 0
    migrated_files = 0
    
    for file_path in ANGULAR_SERVICES.glob('*.ts'):
        if file_path.name in migrated:
            continue
            
        total_files += 1
        service_name = file_path.stem.replace('.service', '')
        dest_path = REACT_SERVICES / file_path.name
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Converte o serviço
            react_content = convert_service_to_react(content, service_name)
            
            # Escreve no destino
            with open(dest_path, 'w', encoding='utf-8') as f:
                f.write(react_content)
            
            migrated_files += 1
            print(f"OK: {file_path.name}")
        except Exception as e:
            print(f"ERRO ao migrar {file_path.name}: {e}")
    
    print(f"\nMigracao concluida: {migrated_files}/{total_files} servicos migrados")

if __name__ == "__main__":
    migrate_services()
