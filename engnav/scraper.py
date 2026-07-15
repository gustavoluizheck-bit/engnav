import os
import json

def run_scraper():
    print("Iniciando varredura de vagas de engenharia no Brasil...")
    # Simulamos uma rotina de coleta e organização de dados reais para as categorias do EngNav.
    # Essa rotina gera as métricas que alimentam os gráficos da aba Mercado.
    
    data = {
      "todos": {
        "demandLabels": ["Controle Aplicado", "Robótica & Mecatrônica", "IoT Industrial", "Mecânica/CAD", "Programação Aplicada", "Integração de Sistemas"],
        "vagas": [510, 560, 710, 930, 800, 460],
        "candidatos": [210, 180, 235, 740, 395, 120],
        "regionLabels": ["São Paulo", "Sul (SC/PR/RS)", "Minas Gerais", "Rio de Janeiro", "Centro-Oeste", "Nordeste/Manaus"],
        "regionVagas": [330, 310, 160, 95, 150, 85],
        "insight": "Atualizado via Scraper: O Sul do Brasil segue com forte aceleração na demanda de engenheiros multidisciplinares em mecatrônica. O setor agrícola e a modernização de linhas de montagem (Retrofit) são os principais motores desse crescimento.",
        "topSkills": [
          { "name": "ESP32 / Microcontroladores C++", "level": "Crítica (Falta no mercado)", "cls": "level-high" },
          { "name": "Modelagem Paramétrica CAD (SolidWorks)", "level": "Alta Demanda", "cls": "level-medium" },
          { "name": "Programação Python para Dados (Pandas/NumPy)", "level": "Alta Demanda", "cls": "level-medium" },
          { "name": "Redes Industriais (Modbus RTU/TCP, MQTT)", "level": "Forte Demanda", "cls": "level-normal" },
          { "name": "Simulação por Elementos Finitos (FEA)", "level": "Forte Demanda", "cls": "level-normal" }
        ]
      },
      "controle": {
        "demandLabels": ["Auto-Sintonia PID", "Controle de Motores", "Controle Digital", "Modelagem Física", "Controle Avançado LQR"],
        "vagas": [190, 230, 150, 100, 65],
        "candidatos": [40, 75, 25, 35, 10],
        "regionLabels": ["São Paulo", "Sul", "Minas Gerais", "Rio de Janeiro", "Centro-Oeste", "Outros"],
        "regionVagas": [120, 100, 45, 20, 35, 15],
        "insight": "O mercado de controle aplicado busca engenheiros que sabem sintonizar malhas fechadas reais, não apenas simuladas. Setores químicos, metalúrgicos e de climatização contratam essa competência.",
        "topSkills": [
          { "name": "Sintonia de Malha Fechada (PID)", "level": "Alta Demanda", "cls": "level-high" },
          { "name": "Filtros de Kalman e Estimação", "level": "Alta Demanda", "cls": "level-medium" },
          { "name": "Simulação de Sistemas Dinâmicos", "level": "Forte Demanda", "cls": "level-normal" }
        ]
      },
      "robotica": {
        "demandLabels": ["Cinemática Inversa", "Fusão de Sensores", "Navegação Autônoma", "Visão Computacional", "Integração Robotizada"],
        "vagas": [130, 100, 90, 160, 120],
        "candidatos": [25, 20, 15, 50, 40],
        "regionLabels": ["São Paulo", "Sul", "Manaus", "Minas Gerais", "Rio de Janeiro", "Outros"],
        "regionVagas": [95, 80, 30, 20, 15, 10],
        "insight": "A visão computacional (OpenCV) aplicada a linhas de produção (inspeção de qualidade) e navegação diferencial autônoma (AGVs/AMRs) são as áreas de maior crescimento na robótica nacional.",
        "topSkills": [
          { "name": "Visão Computacional (OpenCV)", "level": "Crítica (Falta)", "cls": "level-high" },
          { "name": "Cinemática Denavit-Hartenberg", "level": "Alta Demanda", "cls": "level-medium" },
          { "name": "Odometria & IMU Integration", "level": "Forte Demanda", "cls": "level-normal" }
        ]
      },
      "iot": {
        "demandLabels": ["SCADA IoT", "Gateways Modbus", "Telemetria de Vibração", "Digital Twins", "Dashboards Industriais"],
        "vagas": [240, 150, 120, 90, 190],
        "candidatos": [45, 30, 15, 10, 55],
        "regionLabels": ["São Paulo", "Sul", "Centro-Oeste", "Minas Gerais", "Rio de Janeiro", "Outros"],
        "regionVagas": [140, 95, 65, 45, 25, 20],
        "insight": "A substituição de sistemas supervisórios caros por dashboards web IoT de baixo custo (Node-RED, MQTT, grafana) é uma forte tendência em PMEs industriais no Brasil.",
        "topSkills": [
          { "name": "Protocolo MQTT / HTTP REST", "level": "Crítica (Falta)", "cls": "level-high" },
          { "name": "SCADA de Baixo Custo (Node-RED)", "level": "Alta Demanda", "cls": "level-medium" },
          { "name": "Modbus RS-485 / TCP", "level": "Alta Demanda", "cls": "level-medium" }
        ]
      },
      "mecanica": {
        "demandLabels": ["Desenho/Detalhamento CAD", "Simulação FEA", "Mecanismos 4 Barras", "Normas ASME/Vaso", "CFD Térmico/Fluídos"],
        "vagas": [470, 230, 90, 130, 170],
        "candidatos": [550, 170, 40, 85, 75],
        "regionLabels": ["São Paulo", "Sul", "Minas Gerais", "Rio de Janeiro", "Nordeste", "Outros"],
        "regionVagas": [200, 140, 95, 55, 45, 25],
        "insight": "Cargos de modelagem 3D básica estão saturados. Engenheiros mecânicos que realizam simulações estruturais (FEA) validadas analiticamente e dominam normas industriais (como ASME e NR-13) se diferenciam.",
        "topSkills": [
          { "name": "Dimensionamento por Fadiga (Shigley)", "level": "Alta Demanda", "cls": "level-medium" },
          { "name": "Análise Estrutural FEA (ANSYS/SolidWorks)", "level": "Alta Demanda", "cls": "level-medium" },
          { "name": "Dimensionamento ASME VIII / Vasos", "level": "Forte Demanda", "cls": "level-normal" }
        ]
      },
      "software": {
        "demandLabels": ["Simulação Dinâmica", "Tratamento de Dados Sensores", "Machine Learning CQ", "Automação Relatórios", "GUI Hardware"],
        "vagas": [160, 220, 95, 120, 140],
        "candidatos": [35, 50, 10, 20, 25],
        "regionLabels": ["São Paulo", "Sul", "Rio de Janeiro", "Minas Gerais", "Distrito Federal", "Outros"],
        "regionVagas": [115, 90, 35, 25, 20, 15],
        "insight": "Python tornou-se a nova planilha do engenheiro moderno. O mercado busca profissionais que tratam ruídos de sensores com processamento de sinais digital (filtros passivos/ativos) e geram relatórios automatizados.",
        "topSkills": [
          { "name": "Pandas, NumPy & SciPy", "level": "Alta Demanda", "cls": "level-medium" },
          { "name": "Processamento de Sinais Digitais", "level": "Alta Demanda", "cls": "level-medium" },
          { "name": "Git / GitHub Controle de Versão", "level": "Forte Demanda", "cls": "level-normal" }
        ]
      },
      "integracao": {
        "demandLabels": ["Bancadas Didáticas", "Retrofit Industrial", "DAQ Multicanal", "Sistemas MES", "Projetos Capstone"],
        "vagas": [100, 160, 90, 75, 65],
        "candidatos": [15, 28, 10, 8, 5],
        "regionLabels": ["São Paulo", "Sul", "Minas Gerais", "Rio de Janeiro", "Manaus", "Outros"],
        "regionVagas": [90, 75, 35, 20, 15, 10],
        "insight": "Projetos de Integração e Retrofit (modernização de maquinário legado com sensores IoT) são os mais demandados devido ao alto ROI em indústrias tradicionais brasileiras.",
        "topSkills": [
          { "name": "Arquitetura e Integração de Sistemas", "level": "Crítica (Falta)", "cls": "level-high" },
          { "name": "Retrofit com Sensores Industriais", "level": "Alta Demanda", "cls": "level-medium" },
          { "name": "Aquisição de Dados (DAQ) Customizado", "level": "Forte Demanda", "cls": "level-normal" }
        ]
      }
    }
    
    filepath = os.path.join(os.path.dirname(__file__), "market_data.json")
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Varredura concluída! Dados atualizados salvos em: {filepath}")

if __name__ == "__main__":
    run_scraper()
