/* --------------------------------------------------------------------------
   EngNav - Lógica Principal (JavaScript)
   Foco: Manipulação Dinâmica, Gráficos Chart.js, Gap Finder e Chat de IA
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. SISTEMA DE NAVEGAÇÃO DE ABAS
    // ----------------------------------------------------------------------
    const tabs = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Alterar estado dos botões
            tabs.forEach(btn => btn.classList.remove('active'));
            tab.classList.add('active');

            // Alterar visibilidade do conteúdo
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('id') === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 2. DADOS DE MERCADO & GRÁFICOS (CHART.JS)
    // ----------------------------------------------------------------------
    let marketData = {};
    let demandChart = null;
    let regionChart = null;

    // Carregar dados de mercado do market_data.json
    fetch('market_data.json')
        .then(response => response.json())
        .then(data => {
            marketData = data;
            renderCharts('todos');
        })
        .catch(err => {
            console.warn("Falha ao carregar market_data.json, usando dados de fallback.", err);
            // Fallback caso não ache o arquivo JSON
            marketData = {
                todos: {
                    demandLabels: ["Controle Aplicado", "Robótica & Mecatrônica", "IoT Industrial", "Mecânica/CAD", "Programação Aplicada", "Integração de Sistemas"],
                    vagas: [510, 560, 710, 930, 800, 460],
                    candidatos: [210, 180, 235, 740, 395, 120],
                    regionLabels: ["São Paulo", "Sul (SC/PR/RS)", "Minas Gerais", "Rio de Janeiro", "Centro-Oeste", "Nordeste/Manaus"],
                    regionVagas: [330, 310, 160, 95, 150, 85],
                    insight: "Dados locais carregados. A demanda por perfis multidisciplinares que mesclam engenharia mecânica com automação segue em alta.",
                    topSkills: [
                        { name: "ESP32 / Microcontroladores C++", level: "Crítica", cls: "level-high" },
                        { name: "Modelagem Paramétrica CAD (SolidWorks)", level: "Alta Demanda", cls: "level-medium" },
                        { name: "Programação Python (Pandas/NumPy)", level: "Alta Demanda", cls: "level-medium" }
                    ]
                }
            };
            renderCharts('todos');
        });

    function renderCharts(filter) {
        const data = marketData[filter] || marketData['todos'];
        if (!data) return;
        
        if (demandChart) demandChart.destroy();
        if (regionChart) regionChart.destroy();

        const ctxDemand = document.getElementById('demandChart').getContext('2d');
        demandChart = new Chart(ctxDemand, {
            type: 'bar',
            data: {
                labels: data.demandLabels,
                datasets: [
                    {
                        label: 'Vagas Abertas (Demanda)',
                        data: data.vagas,
                        backgroundColor: 'rgba(6, 182, 212, 0.65)',
                        borderColor: '#06b6d4',
                        borderWidth: 1.5,
                        borderRadius: 4
                    },
                    {
                        label: 'Candidatos por Vaga (Oferta)',
                        data: data.candidatos,
                        backgroundColor: 'rgba(16, 185, 129, 0.45)',
                        borderColor: '#10b981',
                        borderWidth: 1.5,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#e2e8f0' } }
                },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
                }
            }
        });

        const ctxRegion = document.getElementById('regionChart').getContext('2d');
        regionChart = new Chart(ctxRegion, {
            type: 'bar',
            data: {
                labels: data.regionLabels,
                datasets: [{
                    label: 'Volume de Vagas Ativas',
                    data: data.regionVagas,
                    backgroundColor: 'rgba(99, 102, 241, 0.65)',
                    borderColor: '#6366f1',
                    borderWidth: 1.5,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
                }
            }
        });

        document.getElementById('insight-text').innerText = data.insight;

        const skillsContainer = document.getElementById('skills-ranking');
        skillsContainer.innerHTML = '';
        data.topSkills.forEach(skill => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="skill-rank-name">${skill.name}</span>
                <span class="skill-rank-level ${skill.cls}">${skill.level}</span>
            `;
            skillsContainer.appendChild(li);
        });
    }

    const selectorSetor = document.getElementById('setor-select');
    selectorSetor.addEventListener('change', (e) => {
        renderCharts(e.target.value);
    });

    // ----------------------------------------------------------------------
    // 3. BIBLIOTECA DE 30 PROJETOS DE BAIXO CUSTO (REFORMULADA V3)
    // ----------------------------------------------------------------------
    const projects = [
        // TRILHA 1: Controle Aplicado
        {
            id: 'P01',
            title: 'Controlador PID de Temperatura com Auto-Sintonia',
            category: 'controle',
            cost: 120,
            costRange: 'R$ 60 - 120',
            difficulty: 'Média',
            time: '10-15 horas',
            prerequisites: [],
            shortDesc: 'Implemente um controlador PID real em microcontrolador com sintonia Ziegler-Nichols.',
            desc: 'Planta de temperatura controlada por sensor DS18B20/LM35 e elemento de aquecimento (resistor cerâmico ou lâmpada). A sintonia automática calcula os parâmetros Kp, Ki e Kd operando o teste de oscilação crítica.',
            materials: ['Arduino Uno ou Nano', 'Sensor de Temperatura DS18B20/LM35', 'Transistor MOSFET IRF540N', 'Resistor Cerâmico de Aquecimento (10 Ohm 10W)', 'Protoboard & Jumpers'],
            steps: ['Monte a malha de aquecimento controlada pelo MOSFET.', 'Fixe o sensor de temperatura acoplado termicamente ao resistor.', 'Escreva a lógica de sintonia automática no Arduino.', 'Execute o teste de oscilação crítica para determinar o período crítico.', 'Defina os ganhos Kp, Ki e Kd calculados e verifique a estabilidade.'],
            code: `// Loop de Controle PID com sintonia Ziegler-Nichols\ndouble kp = 3.6, ki = 0.2, kd = 1.5;\n// Adicione a biblioteca PID_v1 ou implemente discretizado no loop.`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Coloque sob Projetos de Engenharia:',
                bullets: ['Sintonia automática experimental de malha fechada via Ziegler-Nichols.', 'Atenuação de overshoot térmico para erro estacionário inferior a 1.5%.']
            }
        },
        {
            id: 'P02',
            title: 'Controle de Velocidade de Motor DC com Encoder',
            category: 'controle',
            cost: 160,
            costRange: 'R$ 80 - 160',
            difficulty: 'Média',
            time: '15-20 horas',
            prerequisites: ['P01'],
            shortDesc: 'PWM + PID de velocidade com feedback de encoder e perfis de movimento.',
            desc: 'Controle preciso de velocidade de um motor DC com caixa de redução e encoder de quadratura. Implementação de rampas de aceleração e desaceleração para movimentos suaves.',
            materials: ['Motor DC 6V/12V com Encoder acoplado', 'Ponte H L298N ou TB6612FNG', 'Arduino Uno/Nano', 'Fonte de Alimentação Externa 12V'],
            steps: ['Conecte as saídas do encoder nos pinos de interrupção externa do Arduino.', 'Monte o circuito da ponte H para controlar a velocidade via PWM.', 'Implemente a leitura de pulsos por interrupção para obter o RPM real.', 'Sintonize o loop de controle proporcional-integral (PI) de velocidade.'],
            code: `// Leitura do encoder por interrupção externa\nvoid encoderISR() {\n  pulsos++;\n}`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para vaga de Projetos/Controle:',
                bullets: ['Implementação de controle em malha fechada de acionamentos eletromecânicos.', 'Programação de firmware em C++ com tratamento de interrupções de hardware.']
            }
        },
        {
            id: 'P03',
            title: 'Controle Digital: Discretização em µC',
            category: 'controle',
            cost: 50,
            costRange: 'R$ 0 - 50',
            difficulty: 'Avançado',
            time: '10-12 horas',
            prerequisites: ['P01'],
            shortDesc: 'Projete um controlador no domínio S, discretize por Tustin e implemente em C.',
            desc: 'Projeto matemático de controladores no plano S usando MATLAB ou Python (Scipy) e conversão para o domínio discreto Z (Tustin/Bilinear). Implementação direta por equações de diferenças.',
            materials: ['Qualquer microcontrolador (Arduino/ESP32)', 'Software de Simulação (Python/MATLAB)'],
            steps: ['Projete o controlador contínuo para a planta desejada.', 'Aplique a aproximação de Tustin para obter a função de transferência discreta Hz.', 'Obtenha a equação de diferenças no formato y[k] = a*y[k-1] + b*u[k]...', 'Escreva o código no microcontrolador implementando a equação com amostragem fixa.'],
            code: `// Equação de Diferenças implementada no timer de amostragem fixa\nuk = b0*ek + b1*ek1 + a1*uk1;`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para engenheiros de sistemas/controle:',
                bullets: ['Domínio completo de teoria de controle discreto e implementação computacional.', 'Projeto e discretização matemática de compensadores dinâmicos no plano Z.']
            }
        },
        {
            id: 'P04',
            title: 'Controle de Nível com Modelagem de Planta',
            category: 'controle',
            cost: 150,
            costRange: 'R$ 70 - 150',
            difficulty: 'Média',
            time: '12-15 horas',
            prerequisites: ['P01'],
            shortDesc: 'Modelagem dinâmica de reservatório acoplado a sensor ultrassônico e bomba.',
            desc: 'Desenvolvimento de uma bancada hidráulica didática para modelar a resposta transitória de um reservatório de água. Identificação de parâmetros de primeira ordem por curva de reação.',
            materials: ['Mini Bomba de Água 5V/12V', 'Sensor Ultrassônico HC-SR04', 'Reservatório Cilíndrico Transparente', 'Transistor de Potência MOSFET'],
            steps: ['Monte a bancada estrutural do reservatório e bomba de retorno.', 'Realize um ensaio em malha aberta aplicando um degrau na bomba.', 'Registre a curva de nível vs tempo para obter a constante de tempo da planta.', 'Projete o controlador Proporcional-Integral e implemente.'],
            code: `// Cálculo de nível com sensor ultrassônico\ndistancia = (tempoEcho * 0.0343) / 2;`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Controle e Processos:',
                bullets: ['Modelagem matemática e identificação experimental de plantas de primeira ordem.', 'Redução de sobressinal em controle hidráulico de vazão/nível.']
            }
        },
        {
            id: 'P05',
            title: 'Pêndulo Invertido com Controle LQR',
            category: 'controle',
            cost: 250,
            costRange: 'R$ 120 - 250',
            difficulty: 'Avançado',
            time: '25-30 horas',
            prerequisites: ['P02', 'P03'],
            shortDesc: 'Modelagem por equações de Lagrange e controle por realimentação de estados (LQR).',
            desc: 'Projeto mecânico avançado de um pêndulo linear em carro de translação. Equacionamento pelo formalismo de Euler-Lagrange, linearização e sintonia LQR para equilíbrio ativo.',
            materials: ['Motor de Passo Nema 17 ou DC com Encoder', 'Módulo IMU MPU6050 (para inclinação)', 'Guia Linear de Alumínio', 'Correia Dentada e Polias GT2', 'Driver A4988 / Ponte H'],
            steps: ['Desenvolva a modelagem dinâmica do sistema (equações de estado).', 'Projete o controlador LQR em Python para calcular a matriz de ganhos K.', 'Escreva o firmware com leitura rápida da inclinação e controle do atuador.', 'Calibre o ponto de equilíbrio vertical e teste rejeição a distúrbios.'],
            code: `// Cálculo do sinal de controle LQR\nu = -(K[0]*erro_x + K[1]*erro_theta + K[2]*vel_x + K[3]*vel_theta);`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Robótica/Controle Avançado:',
                bullets: ['Equacionamento por mecânica clássica e espaço de estados (LQR).', 'Controle multivariável complexo (MIMO) estável em regime dinâmico crítico.']
            }
        },
        // TRILHA 2: Robótica e Mecatrônica
        {
            id: 'P06',
            title: 'Braço Robótico 4-DOF com Cinemática Inversa',
            category: 'robotica',
            cost: 380,
            costRange: 'R$ 180 - 380',
            difficulty: 'Média',
            time: '20-25 horas',
            prerequisites: ['P02'],
            shortDesc: 'Estrutura CAD 3D, cinemática analítica de Denavit-Hartenberg e controle de coordenadas.',
            desc: 'Manipulador robótico completo. Desenho 3D estrutural e aplicação dos parâmetros de Denavit-Hartenberg para traçar a cinemática inversa, permitindo definir posições X, Y, Z no espaço.',
            materials: ['4x Servomotores Metálicos MG996R', 'Estrutura em MDF, Acrílico ou Impressão 3D', 'Fonte Externa 5V 5A', 'Microcontrolador Arduino/ESP32'],
            steps: ['Projete os braços no SolidWorks e execute corte/impressão.', 'Monte a estrutura conectando as juntas de movimentação nos servos.', 'Calcule as matrizes de transformação de Denavit-Hartenberg.', 'Programe as funções matemáticas de cinemática inversa no firmware.'],
            code: `// Equações geométricas simplificadas para cinemática inversa\ntheta1 = atan2(y, x);`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Mecatrônica / Projeto Mecânico:',
                bullets: ['Projeto e cálculo de cinemática analítica de manipuladores industriais.', 'Integração completa entre desenho mecânico (CAD) e programação embarcada.']
            }
        },
        {
            id: 'P07',
            title: 'Robô Seguidor Autônomo com Filtro de Kalman',
            category: 'robotica',
            cost: 200,
            costRange: 'R$ 90 - 200',
            difficulty: 'Média',
            time: '15-20 horas',
            prerequisites: ['P02'],
            shortDesc: 'Fusão de sensores (encoder + IMU) via Filtro de Kalman para estimativa de pose.',
            desc: 'Construção de uma plataforma robótica diferencial capaz de seguir trajetórias estimando sua exata posição por fusão de sensores, mitigando o ruído e erro cumulativo.',
            materials: ['Chassi de Robô Móvel Diferencial', '2x Motores com Encoders', 'IMU MPU6050 (Acelerômetro/Giroscópio)', 'Arduino ou ESP32', 'Bateria Li-Ion 18650'],
            steps: ['Monte o chassi mecânico diferencial com motores e IMU centralizado.', 'Implemente a leitura rápida dos giroscópios e acelerômetros.', 'Aplique um algoritmo simplificado de Filtro de Kalman/Complementar.', 'Calcule a odometria corrigida e envie os dados em tempo real.'],
            code: `// Filtro Complementar simples (Alternativa ao Kalman básico)\nangulo = 0.98 * (angulo + gyroX * dt) + 0.02 * accelX;`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Engenharia de Sistemas/Automação:',
                bullets: ['Uso de algoritmos de fusão de sensores para redução de incerteza de medição.', 'Modelagem cinemática direta e odometria de robôs móveis diferenciais.']
            }
        },
        {
            id: 'P08',
            title: 'Plataforma Omnidirecional com Odometria',
            category: 'robotica',
            cost: 300,
            costRange: 'R$ 150 - 300',
            difficulty: 'Média',
            time: '15-18 horas',
            prerequisites: ['P07'],
            shortDesc: 'Chassi com rodas omni, cinemática inversa de robótica móvel e odometria.',
            desc: 'Desenvolvimento de um robô capaz de movimentar-se em qualquer direção instantaneamente sem rotacionar. Implementação cinemática de matrizes rotacionais para velocidade de rodas.',
            materials: ['3x ou 4x Rodas Omnidirecionais (Mecanum)', '3x ou 4x Motores DC com Encoder', 'Driver de Motores L293D ou múltiplos módulos', 'Estrutura do Chassi Redondo/Quadrado'],
            steps: ['Projete a base mecânica e monte as rodas nos ângulos corretos (ex: 120° ou 90°).', 'Escreva a matriz cinemática de conversão de vetor de velocidade (Vx, Vy, Wz) em rotação de rodas.', 'Verifique a precisão do robô calculando a odometria integrada por encoders.'],
            code: `// Conversão de velocidade linear para as rodas\nroda1 = vx * cos(a1) + vy * sin(a1) + wz * R;`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Robótica Móvel / AGVs:',
                bullets: ['Implementação de controle cinemático para robôs de locomoção omnidirecional.', 'Integração de firmware para controle sincronizado de múltiplos eixos coordenados.']
            }
        },
        {
            id: 'P09',
            title: 'Visão Computacional OpenCV para Inspeção',
            category: 'robotica',
            cost: 80,
            costRange: 'R$ 0 - 80',
            difficulty: 'Média',
            time: '12-15 horas',
            prerequisites: [],
            shortDesc: 'Processamento de imagem em Python para controle de qualidade e contagem de peças.',
            desc: 'Criação de um sistema de visão artificial em Python para identificar falhas dimensionais em peças passando por uma esteira. Inspeção visual automatizada de baixo custo.',
            materials: ['Computador com Python instalado', 'Webcam comum ou câmera de celular', 'Caixa com iluminação padronizada (Papelão/MDF)'],
            steps: ['Configure o Python com a biblioteca OpenCV e NumPy.', 'Posicione a câmera focando na área de inspeção de peças.', 'Desenvolva rotinas de binarização de imagem, filtro Gaussiano e detecção de contornos Canny.', 'Calcule a dimensão em pixels e converta para milímetros reais usando um gabarito.'],
            code: `import cv2\n# Carregar imagem e achar contornos\ngray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)\nedges = cv2.Canny(gray, 50, 150)`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Controle de Qualidade / Indústria 4.0:',
                bullets: ['Processamento de imagem em tempo real para automação industrial de inspeção.', 'Desenvolvimento de algoritmos de visão computacional com calibração espacial de câmera.']
            }
        },
        {
            id: 'P10',
            title: 'Célula Robótica Pick-and-Place',
            category: 'robotica',
            cost: 450,
            costRange: 'R$ 250 - 450',
            difficulty: 'Avançado',
            time: '30-40 horas',
            prerequisites: ['P06', 'P09'],
            shortDesc: 'Integração de braço robótico + visão computacional para triagem autônoma.',
            desc: 'Projeto Capstone da trilha de robótica. Uma câmera detecta a posição de blocos sobre uma mesa de trabalho e transmite as coordenadas reais para o braço robótico, que manipula e organiza os objetos.',
            materials: ['Braço Robótico 3/4-DOF montado', 'Webcam conectada ao Computador', 'Arduino ou ESP32 conectando braço ao PC via Serial/Wi-Fi'],
            steps: ['Execute a calibração da câmera para determinar a matriz de homografia (Pixels para Milímetros da mesa).', 'Programe o script Python de detecção visual para identificar objetos e suas coordenadas angulares.', 'Envie os comandos via Serial (G-Code simplificado) para o microcontrolador do braço.', 'Programe o braço para capturar o objeto e posicioná-lo no destino correto.'],
            code: `// Protocolo Serial Simples no Arduino para receber coordenadas\nif (Serial.available()) { x = Serial.parseFloat(); y = Serial.parseFloat(); }`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Integração Mecatrônica Avançada:',
                bullets: ['Integração de hardware robótico com inteligência visual em malha aberta de decisão.', 'Desenvolvimento de protocolos de comunicação customizados entre sistemas de alto e baixo nível.']
            }
        },
        // TRILHA 3: IoT Industrial e SCADA
        {
            id: 'P11',
            title: 'SCADA IoT de Baixo Custo com ESP32',
            category: 'iot',
            cost: 120,
            costRange: 'R$ 50 - 120',
            difficulty: 'Média',
            time: '15-20 horas',
            prerequisites: [],
            shortDesc: 'Monitore sensores em tempo real via ESP32, protocolo MQTT e painéis Node-RED.',
            desc: 'Arquitetura completa de IIoT para aquisição de variáveis analógicas de temperatura, vibração ou umidade e envio via Wi-Fi no protocolo leve MQTT para centralização no Node-RED.',
            materials: ['ESP32 NodeMCU', 'Sensor DHT22/LM35', 'Acelerômetro MPU6050', 'Protoboard e Fios', 'Servidor Local Node-RED (PC)'],
            steps: ['Conecte os sensores no barramento I2C e portas analógicas do ESP32.', 'Escreva o firmware conectando ao Wi-Fi e inicializando um cliente MQTT.', 'Publique os dados dos sensores periodicamente em formato JSON em tópicos específicos.', 'Configure o broker MQTT local (como o Mosquitto).', 'Crie um dashboard elegante no Node-RED consumindo os tópicos.'],
            code: `#include <PubSubClient.h>\nclient.publish("sensores/motor1", "{ \\"temp\\": 35.5 }");`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Indústria 4.0 / Digitalização:',
                bullets: ['Desenvolvimento de arquitetura IIoT ponta-a-ponta (Borda até Dashboard de Supervisão).', 'Implementação de comunicação baseada em mensageria leve (MQTT) e formatação JSON.']
            }
        },
        {
            id: 'P12',
            title: 'Gateway Modbus RTU para MQTT',
            category: 'iot',
            cost: 140,
            costRange: 'R$ 60 - 140',
            difficulty: 'Média',
            time: '15-18 horas',
            prerequisites: ['P11'],
            shortDesc: 'Gateway de rede industrial convertendo RS-485 Modbus para protocolos IoT.',
            desc: 'Integração de equipamentos industriais legados com a nuvem. O ESP32 atua como Mestre Modbus coletando dados via RS-485 e republicando via MQTT na rede corporativa.',
            materials: ['ESP32 NodeMCU', 'Módulo Conversor TTL para RS-485 (MAX485)', 'Resistores de terminação (120 Ohm)', 'Equipamento ou Simulador Modbus Escravo'],
            steps: ['Conecte o conversor MAX485 na porta serial de hardware do ESP32.', 'Implemente a biblioteca ModbusMaster para ler dados de holding registers.', 'Formate os registradores de 16 bits recebidos e monte a payload MQTT.', 'Valide a comunicação e configure tratamento de timeout de barramento.'],
            code: `// Chamada Modbus Master\nresult = node.readHoldingRegisters(0x40001, 2);`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Conectividade e Redes Industriais:',
                bullets: ['Desenvolvimento de hardware de conversão de barramentos físicos industriais (RS-485 para Ethernet/Wi-Fi).', 'Domínio de protocolos legados (Modbus RTU) integrado a tendências modernas de IoT.']
            }
        },
        {
            id: 'P13',
            title: 'Monitoramento de Vibração para Preditiva',
            category: 'iot',
            cost: 100,
            costRange: 'R$ 40 - 100',
            difficulty: 'Avançado',
            time: '18-22 horas',
            prerequisites: ['P11'],
            shortDesc: 'Acelerômetro IMU + Processamento FFT no microcontrolador para análise de espectro.',
            desc: 'Desenvolvimento de uma sonda de vibração preditiva capaz de registrar acelerações de motores e executar uma Transformada Rápida de Fourier (FFT) para verificar desbalanceamentos no espectro.',
            materials: ['ESP32 ou microcontrolador ARM de alta performance', 'Acelerômetro de alta precisão (ADXL345 ou MPU6050)', 'Base metálica para acoplamento mecânico rígido'],
            steps: ['Fixe a IMU solidamente à carcaça do motor sob ensaio.', 'Amostre a aceleração em alta frequência (ex: 1kHz ou mais).', 'Implemente a biblioteca FFT no firmware para computar o espectro de frequência.', 'Identifique picos que indicam desalinhamento (1x rotação) ou falha de rolamento (alta frequência).', 'Publique o espectro consolidado no dashboard.'],
            code: `#include <arduinoFFT.h>\nFFT.Compute(vReal, vImag, samples, FFT_FORWARD);`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Manutenção Preditiva / Confiabilidade:',
                bullets: ['Desenvolvimento de dispositivo de instrumentação e monitoramento preditivo de ativos rotativos.', 'Programação embarcada de algoritmos de processamento digital de sinais em tempo real (FFT).']
            }
        },
        {
            id: 'P14',
            title: 'Digital Twin de Processo Térmico',
            category: 'iot',
            cost: 60,
            costRange: 'R$ 0 - 60',
            difficulty: 'Média',
            time: '12-15 horas',
            prerequisites: ['P01', 'P11'],
            shortDesc: 'Modelo dinâmico matemático em Python rodando em sincronia com a planta térmica.',
            desc: 'Integração de modelagem física e IoT. Um script Python calcula continuamente a resposta esperada da planta térmica com base em modelo diferencial matemático e plota ao lado dos dados reais do hardware.',
            materials: ['Planta térmica simples do projeto P01', 'Computador com Python'],
            steps: ['Identifique os parâmetros de capacitância e resistência térmica da planta real.', 'Escreva o modelo diferencial de transferência de calor em Python.', 'Sincronize o script Python via MQTT para ler o setpoint e o sinal de controle reais da planta.', 'Exiba as curvas do modelo vs real em um painel do Streamlit ou dashboard customizado.'],
            code: `import numpy as np\n# Resolução numérica de EDO térmica\ndT_dt = (T_amb - T) / (R_th * C_th) + Q_in / C_th`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Digital Twin / P&D:',
                bullets: ['Desenvolvimento de Gêmeo Digital (Digital Twin) básico de planta térmica.', 'Sincronização de simulação de hardware-in-the-loop (HIL) com sensores físicos IoT.']
            }
        },
        {
            id: 'P15',
            title: 'Dashboard de OEE Industrial',
            category: 'iot',
            cost: 0,
            costRange: 'R$ 0',
            difficulty: 'Média',
            time: '10-12 horas',
            prerequisites: ['P11'],
            shortDesc: 'Cálculo de Disponibilidade × Performance × Qualidade em painel central.',
            desc: 'Criação de um sistema de software que computa o indicador OEE (Overall Equipment Effectiveness) em tempo real, monitorando ciclos de trabalho e falhas em uma simulação de esteira industrial.',
            materials: ['Computador com Node-RED ou Python rodando localmente'],
            steps: ['Estruture a coleta de estados da máquina (Produzindo, Parada, Falha).', 'Implemente o contador de peças produzidas totais e defeituosas.', 'Codifique as fórmulas matemáticas do OEE no Node-RED.', 'Exiba gráficos históricos de perdas de produtividade por paradas não planejadas.'],
            code: `// Cálculo simplificado de OEE\nconst oee = disponibilidade * performance * qualidade;`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Indicadores Industriais (PCM):',
                bullets: ['Desenvolvimento de ferramenta digital para cálculo em tempo real de OEE e perdas de manufatura.', 'Domínio de lógica e regras de negócios voltadas a planejamento e controle de manutenção (PCM).']
            }
        },
        // TRILHA 4: Projeto Mecânico e Simulação
        {
            id: 'P16',
            title: 'Projeto de Redutor de Velocidade (CAD+FEA)',
            category: 'mecanica',
            cost: 0,
            costRange: 'R$ 0',
            difficulty: 'Média',
            time: '20-25 horas',
            prerequisites: [],
            shortDesc: 'Dimensionamento analítico por Shigley e modelagem SolidWorks com análise estrutural.',
            desc: 'Projeto mecânico clássico e rigoroso de uma caixa de redução de engrenagens cilíndricas de dentes retos. Dimensionamento analítico de engrenagens, eixos e chavetas com validação por simulação computacional de tensões.',
            materials: ['Software SolidWorks ou Fusion 360 ou Inventor', 'Livro Didático Shigley (Dimensionamento)'],
            steps: ['Calcule o torque e a potência para dimensionar os dentes da engrenagem (norma AGMA).', 'Projete o diâmetro do eixo considerando flexão e torção combinadas por fadiga.', 'Crie a montagem paramétrica em CAD 3D de todas as peças (eixos, engrenagens, mancais).', 'Execute a simulação FEA de contato nos dentes e tensões de torção no eixo principal.'],
            code: `// Memorial analítico de cálculo detalhado do coeficiente de segurança por Soderberg/Gerber`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Projeto / Análise Estrutural:',
                bullets: ['Dimensionamento analítico de eixos de transmissão de potência e engrenagens contra falha por fadiga.', 'Simulação estática e contato FEA de montagens complexas com verificação de convergência de malha.']
            }
        },
        {
            id: 'P17',
            title: 'Análise Estrutural FEA de Treliça',
            category: 'mecanica',
            cost: 0,
            costRange: 'R$ 0',
            difficulty: 'Fácil',
            time: '8-10 horas',
            prerequisites: ['P16'],
            shortDesc: 'Cálculo analítico de tensões axiais em vigas e comparação direta com simulação.',
            desc: 'Modelagem e simulação por elementos finitos de uma estrutura de suporte mecânico treliçado. Comparação dos resultados numéricos obtidos pelo software com os cálculos manuais de método dos nós.',
            materials: ['Software de CAD/CAE (SolidWorks Simulation, ANSYS ou SimScale)'],
            steps: ['Projete a treliça no CAD utilizando perfis estruturais comuns.', 'Calcule manualmente as forças internas axiais em cada viga aplicando cargas no nó superior.', 'Configure o estudo FEA definindo materiais reais, fixações rígidas e as forças correspondentes.', 'Gere a malha de elementos de viga (Beam Elements) e compare as forças calculadas.'],
            code: `// Tabela de comparação: Força Analítica vs Força FEA (Diferença percentual < 1%)`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Engenharia de Cálculo:',
                bullets: ['Estruturação de análises lineares estruturais com modelagem de elementos de vigas.', 'Validação e calibração de resultados de simulação (FEA) baseados em cálculo analítico estático.']
            }
        },
        {
            id: 'P18',
            title: 'Mecanismo 4 Barras: Síntese e Cinemática',
            category: 'mecanica',
            cost: 40,
            costRange: 'R$ 0 - 40',
            difficulty: 'Média',
            time: '12-15 horas',
            prerequisites: ['P16'],
            shortDesc: 'Síntese de 3 posições, simulação dinâmica de movimento em CAD e fabricação impressa.',
            desc: 'Projeto dinâmico de um mecanismo de quatro barras acoplado para realizar uma trajetória específica. Aplicação da Lei de Grashof para garantir rotatividade total.',
            materials: ['CAD 3D (SolidWorks/Fusion)', 'Software Linkage (gratuito) ou scripts Python', 'MDF/Acrílico cortado ou Impressão 3D para protótipo físico'],
            steps: ['Realize a síntese gráfica de 3 posições desejadas do acoplador para definir os comprimentos das barras.', 'Verifique a Lei de Grashof correspondente.', 'Simule o comportamento dinâmico e forças nas juntas de rotação no SolidWorks Motion.', 'Exporte em DXF e corte/imprima para montagem e teste físico de trajetória.'],
            code: `// Cálculo da equação de loop de circuito fechado para cinemática plana (Freudenstein)`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Desenvolvimento Mecânico:',
                bullets: ['Desenvolvimento e síntese de mecanismos articulados planos de alta confiabilidade dinâmica.', 'Análise cinemática computacional de acelerações e velocidades angulares de juntas articuladas.']
            }
        },
        {
            id: 'P19',
            title: 'Projeto de Vaso de Pressão (ASME VIII)',
            category: 'mecanica',
            cost: 0,
            costRange: 'R$ 0',
            difficulty: 'Avançado',
            time: '15-20 horas',
            prerequisites: ['P16'],
            shortDesc: 'Dimensionamento analítico detalhado segundo as normas ASME Seção VIII Divisão 1.',
            desc: 'Projeto e dimensionamento mecânico estrutural de um vaso de pressão cilíndrico industrial sujeito a pressões internas significativas. Aplicação direta das normas regulamentadoras nacionais (NR-13).',
            materials: ['Planilha de Cálculo (Excel/Python)', 'Norma ASME Section VIII Division 1 (Consultar resumos)'],
            steps: ['Determine a espessura mínima necessária do cilindro e das calotas elípticas ou torisféricas.', 'Dimensione reforços para bocais de entrada e saída.', 'Selecione os materiais de aço apropriados com base em tabelas de tensões admissíveis da norma.', 'Documente em um relatório estruturado no formato de memorial de cálculo oficial.'],
            code: `t = (P * R) / (S * E - 0.6 * P); // Fórmula da espessura cilíndrica da calota ASME`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Vasos de Pressão / Caldeiras:',
                bullets: ['Dimensionamento e projeto de vasos de pressão industriais segundo códigos internacionais ASME VIII Div. 1.', 'Adequação legal de equipamentos mecânicos pressurizados em consonância com a NR-13.']
            }
        },
        {
            id: 'P20',
            title: 'Análise Térmica CFD de Trocador de Calor',
            category: 'mecanica',
            cost: 0,
            costRange: 'R$ 0',
            difficulty: 'Avançado',
            time: '18-24 horas',
            prerequisites: ['P16'],
            shortDesc: 'Dimensionamento térmico por LMTD/NTU e simulação simplificada de fluídos.',
            desc: 'Projeto termo-hidráulico de um trocador de calor de duplo tubo. Dimensionamento matemático preliminar e simulação CFD em 3D para visualizar contornos de temperatura e quedas de pressão.',
            materials: ['ANSYS Fluent ou Fusion 360 CFD ou SimScale (Software gratuito na nuvem)'],
            steps: ['Determine a área de troca de calor necessária aplicando o método da Média Logarítmica das Diferenças de Temperatura (LMTD).', 'Desenhe a malha geométrica dos volumes fluidos (interno e anular) em CAD.', 'Gere a malha de volumes finitos definindo as regiões de contorno de parede de troca.', 'Execute a simulação CFD calculando os coeficientes de transferência de calor por convecção e compare com a literatura.'],
            code: `// Cálculo da LMTD\ndeltaT = (dT1 - dT2) / log(dT1 / dT2);`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Fluídos e Térmica / CFD:',
                bullets: ['Simulação termo-fluidodinâmica (CFD) aplicada a trocadores de calor industriais.', 'Dimensionamento analítico e calibração de malha computacional para escoamento turbulento convector.']
            }
        },
        // TRILHA 5: Programação Aplicada à Engenharia
        {
            id: 'P21',
            title: 'Simulação Dinâmica de Sistemas (Scipy)',
            category: 'software',
            cost: 0,
            costRange: 'R$ 0',
            difficulty: 'Média',
            time: '10-12 horas',
            prerequisites: [],
            shortDesc: 'Modelagem por EDOs (massa-mola-amortecedor) resolvidas numericamente em Python.',
            desc: 'Uso do Python (Scipy/Matplotlib) como ferramenta avançada de análise dinâmica. Resolução de equações diferenciais ordinárias que descrevem sistemas mecânicos vibratórios ou circuitos eletrônicos.',
            materials: ['Computador com Python instalado (Ambiente Anaconda ou Jupyter Notebook)'],
            steps: ['Escreva as equações diferenciais ordinárias de movimento da planta.', 'Codifique a função do sistema de equações em formato vetorial compatível com Python.', 'Utilize o integrador numérico scipy.integrate.solve_ivp.', 'Plote a resposta temporal e analise a estabilidade dinêmica sob diferentes amortecimentos.'],
            code: `from scipy.integrate import solve_ivp\ndef f(t, y): return [y[1], -k*y[0] - c*y[1]]\nsol = solve_ivp(f, [0, 10], [1.0, 0.0])`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Engenharia de Simulação:',
                bullets: ['Desenvolvimento de simulações numéricas de dinâmica de sistemas físicos por EDOs.', 'Domínio de ferramentas Python (SciPy/NumPy) para prototipagem matemática de projetos mecânicos.']
            }
        },
        {
            id: 'P22',
            title: 'Análise de Dados de Sensores (Pandas)',
            category: 'software',
            cost: 0,
            costRange: 'R$ 0',
            difficulty: 'Média',
            time: '12-15 horas',
            prerequisites: ['P21'],
            shortDesc: 'Importação, filtragem digital e tratamento estatístico de arquivos de dados brutos.',
            desc: 'Leitura e manipulação de planilhas e logs de ensaios contendo ruídos. Aplicação de filtros passa-baixas Butterworth e cálculos estatísticos usando bibliotecas Pandas em Python.',
            materials: ['Ambiente Python com Jupyter Notebook e Pandas/SciPy'],
            steps: ['Carregue o log CSV de um ensaio de sensor ruidoso.', 'Limpe os dados identificando e removendo outliers estatísticos (z-score).', 'Projete e aplique um filtro Butterworth digital para atenuar ruído de alta frequência.', 'Gere relatórios visuais com histogramas, médias móveis e desvios padrões.'],
            code: `import pandas as pd\nfrom scipy.signal import butter, lfilter\ndf = pd.read_csv('sensor_log.csv')\n# Filtragem digital...`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Processamento de Sinais / PCM:',
                bullets: ['Tratamento automatizado de bases de dados de telemetria de sensores industriais.', 'Projeto e aplicação de filtros digitais e tratamento estatístico de sinais com Pandas e SciPy.']
            }
        },
        {
            id: 'P23',
            title: 'Machine Learning para Controle de Qualidade',
            category: 'software',
            cost: 0,
            costRange: 'R$ 0',
            difficulty: 'Avançado',
            time: '20-25 horas',
            prerequisites: ['P22'],
            shortDesc: 'Treinamento de um algoritmo de classificação de falhas de vibração ou imagem.',
            desc: 'Modelagem preditiva simples. Classificação de falhas com base em espectro de vibração ou características de peças extraídas de sensores. Treinamento de modelos como Random Forest.',
            materials: ['Computador com Python e Scikit-Learn'],
            steps: ['Prepare a base de dados rotulando amostras normais e falhas.', 'Extraia características estatísticas fundamentais dos sinais (RMS, Curtose, Frequência).', 'Divida a base em dados de treino e teste e treine um classificador do Scikit-Learn.', 'Verifique a precisão e plote a matriz de confusão correspondente.'],
            code: `from sklearn.ensemble import RandomForestClassifier\nmodel = RandomForestClassifier()\nmodel.fit(X_train, y_train)`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para Preditiva / Engenharia Avançada:',
                bullets: ['Modelagem preditiva e inteligência artificial aplicada ao monitoramento de ativos mecânicos.', 'Desenvolvimento de rotinas completas de extração de features e validação de modelos de ML.']
            }
        },
        {
            id: 'P24',
            title: 'Automação de Relatórios em Python+LaTeX',
            category: 'software',
            cost: 0,
            costRange: 'R$ 0',
            difficulty: 'Fácil',
            time: '8-10 horas',
            prerequisites: ['P22'],
            shortDesc: 'Script que lê dados brutos de ensaio e gera automaticamente um relatório PDF formatado.',
            desc: 'Desenvolvimento de uma ferramenta em Python que elimina o preenchimento manual de relatórios de ensaios. O script carrega os dados de calibração, gera gráficos e monta um arquivo LaTeX compilado.',
            materials: ['Computador com Python e compilador LaTeX local ou API em nuvem'],
            steps: ['Crie um arquivo de template LaTeX contendo tags de substituição.', 'Escreva o script Python para processar os dados brutos de calibração.', 'Substitua as tags do arquivo LaTeX e chame o compilador via comando terminal de sistema.', 'Verifique o PDF formatado e padronizado gerado instantaneamente.'],
            code: `import os\n# Comando terminal compilando o arquivo gerado\nos.system('pdflatex relatorio.tex')`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Metodologias de Produtividade:',
                bullets: ['Automação de fluxos de P&D reduzindo o tempo de elaboração de relatórios técnicos em 95%.', 'Integração de geração automatizada de relatórios em PDF com processamento numérico.']
            }
        },
        {
            id: 'P25',
            title: 'Interface Gráfica (GUI) para Instrumentação',
            category: 'software',
            cost: 40,
            costRange: 'R$ 0 - 40',
            difficulty: 'Média',
            time: '12-15 horas',
            prerequisites: ['P21'],
            shortDesc: 'Criação de software desktop em Python (PyQt) para controle serial de hardware.',
            desc: 'Desenvolvimento de um software de controle de bancadas didáticas. A interface permite alterar parâmetros do firmware (setpoints) e plota gráficos em tempo real da leitura analógica recebida da serial.',
            materials: ['Computador com Python (PyQt ou Tkinter)', 'Placa Arduino de baixo custo'],
            steps: ['Implemente a comunicação serial bidirecional no Arduino.', 'Projete a interface visual (widgets de controle, botões e área de plotagem).', 'Escreva a rotina em thread secundária no Python para ler a porta serial sem travar a interface.', 'Configure gráficos interativos rodando em tempo real com matplotlib ou pyqtgraph.'],
            code: `import serial\nser = serial.Serial('COM3', 115200)\n# Leitura em thread separada...`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Para P&D e Instrumentação:',
                bullets: ['Desenvolvimento de interfaces supervisórias e painéis de controle industriais customizados via software.', 'Programação orientada a eventos e processamento multithreading para recepção serial em alta velocidade.']
            }
        },
        // TRILHA 6: Integração de Sistemas
        {
            id: 'P26',
            title: 'Bancada Didática de Automação',
            category: 'integracao',
            cost: 400,
            costRange: 'R$ 200 - 400',
            difficulty: 'Avançado',
            time: '30-40 horas',
            prerequisites: ['P04', 'P12'],
            shortDesc: 'Integração estrutural de múltiplos atuadores, sensores industriais e microcontrolador.',
            desc: 'Construção física de uma maquete didática simulando um processo industrial real de mistura ou triagem. Projeto mecânico e automação integrada.',
            materials: ['Sensores ópticos e capacitivos', 'Mini válvulas solenoides ou servomotores', 'Relés eletromecânicos de isolamento', 'Estrutura suporte de montagem rápida'],
            steps: ['Projete a montagem estrutural mecânica fixando os atuadores de fluido e sensores.', 'Estruture a caixa de controle eletroeletrônica com bornes e canaletas organizadoras.', 'Escreva a lógica de programação do CLP ou microcontrolador central.', 'Valide a operação automática em malha fechada e adicione botões de emergência físicos.'],
            code: `// Sequência automatizada de mistura industrial (Máquina de estados)\nswitch(estado) { case ENCHENDO: ... }`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Projetos Multidisciplinares:',
                bullets: ['Projeto e integração física e lógica de sistemas dinâmicos de automação.', 'Aplicação prática de normas de proteção elétrica, isolamento de ruído e segurança industrial de máquinas.']
            }
        },
        {
            id: 'P27',
            title: 'Retrofit de Equipamento Convencional',
            category: 'integracao',
            cost: 250,
            costRange: 'R$ 100 - 250',
            difficulty: 'Avançado',
            time: '25-30 horas',
            prerequisites: ['P11', 'P13'],
            shortDesc: 'Modernização de máquina legada com sensores de telemetria IoT sem interferência funcional.',
            desc: 'Aplicação real de Engenharia de Sistemas e IoT. Instalação de sensores e monitoramento inteligente em um equipamento analógico convencional antigo (como uma furadeira manual de bancada).',
            materials: ['Microcontrolador ESP32', 'Sensores não intrusivos (corrente por efeito Hall, termopar magnético, vibração)', 'Estruturas de fixação impressas em 3D'],
            steps: ['Estude o funcionamento do equipamento antigo para definir pontos de coleta não intrusivos.', 'Dimensione suportes em CAD e fabrique via impressão 3D para acoplar os sensores.', 'Monte a caixa coletora de dados e ligue os sensores.', 'Transmita os dados de ciclo de vida e vibração para a nuvem preditiva.'],
            code: `// Cálculo de corrente RMS não intrusiva com sensor Hall ACS712`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Retrofit e Confiabilidade:',
                bullets: ['Modernização (Retrofit) tecnológica de ativos mecânicos analógicos industriais.', 'Desenvolvimento de sistemas de monitoramento embarcado não intrusivo para confiabilidade operacional.']
            }
        },
        {
            id: 'P28',
            title: 'Sistema DAQ Multicanal customizado',
            category: 'integracao',
            cost: 180,
            costRange: 'R$ 80 - 180',
            difficulty: 'Avançado',
            time: '20-25 horas',
            prerequisites: ['P22', 'P25'],
            shortDesc: 'Placa de aquisição de alta velocidade com múltiplos canais analógicos e software de log.',
            desc: 'Substituto de baixo custo para placas de aquisição comerciais (DAQ). Hardware com condicionamento de sinal analógico, filtros passivos anti-aliasing e comunicação em alta velocidade com PC.',
            materials: ['Módulo ADC externo de precisão (ex: ADS1115)', 'Amplificador Operacional para buffer', 'Filtros capacitivos', 'Microcontrolador ESP32/Arduino', 'Software Python no PC'],
            steps: ['Projete o circuito de condicionamento de sinal analógico com OpAmps.', 'Monte os filtros de ruído passivos RC passa-baixa.', 'Programe o microcontrolador para ler em alta frequência via barramento SPI/I2C.', 'Desenvolva o software Python para gravação contínua dos dados em tempo real em formato binário.'],
            code: `// Aquisição via ADS1115 I2C no Arduino\nadc0 = ads.readADC_SingleEnded(0);`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Instrumentação e Sinais:',
                bullets: ['Desenvolvimento de placas de aquisição (DAQ) dedicadas de alta precisão com filtragem anti-aliasing.', 'Conhecimento aprofundado em processamento analógico de condicionamento e impedância de sensores.']
            }
        },
        {
            id: 'P29',
            title: 'Sistema MES de Manufatura Integrada',
            category: 'integracao',
            cost: 0,
            costRange: 'R$ 0',
            difficulty: 'Avançado',
            time: '20-30 horas',
            prerequisites: ['P11', 'P15'],
            shortDesc: 'Software que gerencia ordens de produção, rastreia peças e integra com SCADA.',
            desc: 'Integração de TI e Automação (TA). Software centralizado em Python/Node-RED que controla ordens de produção enviadas para as bancadas de teste, rastreando andamento e eficiências.',
            materials: ['Computador rodando servidores Python, banco de dados (SQLite) e Node-RED'],
            steps: ['Modele a estrutura do banco de dados para ordens de serviço e lotes.', 'Escreva APIs REST ou tópicos MQTT para os controladores de borda requisitarem a próxima tarefa.', 'Monte um portal administrativo para criação de novas ordens.', 'Integre a atualização automática do banco a partir dos sensores de fim de ciclo da planta.'],
            code: `import sqlite3\n# Criação de tabela de ordens de serviço no banco de dados SQLite\nconn = sqlite3.connect('mes_db.db')`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Sistemas MES / Manufatura 4.0:',
                bullets: ['Desenvolvimento de sistema MES corporativo integrado para controle operacional de chão de fábrica.', 'Domínio de bancos de dados relacionais e APIs de comunicação aplicadas à engenharia de manufatura.']
            }
        },
        {
            id: 'P30',
            title: 'Célula de Manufatura (Capstone)',
            category: 'integracao',
            cost: 600,
            costRange: 'R$ 300 - 600',
            difficulty: 'Avançado',
            time: '40-60 horas',
            prerequisites: ['P06', 'P09', 'P12'],
            shortDesc: 'Projeto final integrando Robótica, Visão OpenCV, IIoT e controle em malha fechada.',
            desc: 'A integração de todas as trilhas do EngNav. Uma esteira transportadora, monitorada por sensores ópticos e visão artificial, leva peças até um braço robótico que faz a triagem. Todo o processo é monitorado por um gateway Modbus industrial que envia dados em tempo real para um dashboard de OEE e MES.',
            materials: ['Esteira didática (motorizada)', 'Braço Robótico montado', 'Câmera com OpenCV', 'ESP32 Gateway Modbus + Broker local MQTT'],
            steps: ['Monte mecanicamente a célula unindo a esteira e a zona de atuação do braço.', 'Configure os barramentos de comunicação para sincronizar a parada da esteira e ativação da câmera.', 'Implemente a lógica central sequencial de segurança na célula.', 'Publique os status operacionais no supervisório geral.'],
            code: `// firmware central da célula (Lógica sequencial paralela complexa)`,
            curriculum: {
                title: 'Destaque no Currículo:',
                desc: 'Projeto Capstone Multidisciplinar:',
                bullets: ['Desenvolvimento completo de projeto integrador de célula de manufatura simulando padrões industriais reais.', 'Liderança técnica em projetos de engenharia complexa envolvendo IoT, Robótica e software central de controle.']
            }
        }
    ];

    // RENDERIZAR PROJETOS NA TELA
    const projectsContainer = document.getElementById('projects-container');
    const budgetSelect = document.getElementById('budget-select');
    const categoryButtons = document.querySelectorAll('.filter-btn');

    let activeCategory = 'todos';

    function updateProgressDashboard() {
        let total = projects.length;
        let notStarted = 0;
        let inProgress = 0;
        let completed = 0;

        projects.forEach(p => {
            const status = localStorage.getItem('engnav_status_' + p.id) || 'not-started';
            if (status === 'completed') completed++;
            else if (status === 'in-progress') inProgress++;
            else notStarted++;
        });

        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        const statsText = document.getElementById('progress-stats-text');
        const barFill = document.getElementById('progress-bar-fill');
        const statsNotStarted = document.getElementById('stats-not-started');
        const statsInProgress = document.getElementById('stats-in-progress');
        const statsCompleted = document.getElementById('stats-completed');

        if (statsText) statsText.innerText = `${completed} de ${total} concluídos (${percent}%)`;
        if (barFill) barFill.style.width = `${percent}%`;
        if (statsNotStarted) statsNotStarted.innerText = `${notStarted} Não Iniciados`;
        if (statsInProgress) statsInProgress.innerText = `${inProgress} Em Execução`;
        if (statsCompleted) statsCompleted.innerText = `${completed} Concluídos`;
    }

    function isProjectLocked(project) {
        if (!project.prerequisites || project.prerequisites.length === 0) return false;
        for (let preId of project.prerequisites) {
            const preStatus = localStorage.getItem('engnav_status_' + preId) || 'not-started';
            if (preStatus !== 'completed') return true;
        }
        return false;
    }

    function renderProjects() {
        projectsContainer.innerHTML = '';
        const maxBudget = budgetSelect.value;
        
        const filteredProjects = projects.filter(p => {
            const matchesCategory = (activeCategory === 'todos' || p.category === activeCategory);
            const matchesBudget = (maxBudget === 'all' || p.cost <= parseInt(maxBudget));
            return matchesCategory && matchesBudget;
        });

        if (filteredProjects.length === 0) {
            projectsContainer.innerHTML = `
                <div class="card glass text-center" style="grid-column: 1 / -1; padding: 40px;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; color: var(--warning); margin-bottom: 12px;"></i>
                    <h3>Nenhum projeto encontrado</h3>
                    <p class="text-muted">Tente ajustar seus filtros de custo máximo ou categoria.</p>
                </div>
            `;
            return;
        }

        filteredProjects.forEach(project => {
            const status = localStorage.getItem('engnav_status_' + project.id) || 'not-started';
            const locked = isProjectLocked(project);
            
            const statusTranslations = {
                'not-started': 'Não Iniciado',
                'in-progress': 'Em Execução',
                'completed': 'Concluído'
            };

            const card = document.createElement('div');
            card.className = `project-card glass ${locked ? 'locked' : ''}`;
            if (locked) {
                card.style.opacity = '0.55';
            }
            
            // Build dependency warning
            let depWarning = '';
            if (locked && project.prerequisites.length > 0) {
                const depNames = project.prerequisites.map(id => {
                    const p = projects.find(pr => pr.id === id);
                    return p ? p.id : id;
                }).join(', ');
                depWarning = `<p style="font-size:0.75rem; color:var(--warning); margin-top:0.25rem;"><i class="fa-solid fa-lock"></i> Requer: ${depNames}</p>`;
            }

            card.innerHTML = `
                <span class="card-status-badge ${status}">${statusTranslations[status]}</span>
                <span class="project-badge">${project.difficulty}</span>
                <div class="project-body" style="padding-top: 48px;">
                    <h3>${locked ? '<i class="fa-solid fa-lock" style="font-size:1rem; margin-right:4px;"></i>' : ''}${project.title}</h3>
                    <p>${project.shortDesc}</p>
                    ${depWarning}
                    <div class="project-meta">
                        <div class="project-cost">
                            <span class="project-cost-label">Custo Estimado</span>
                            <span class="project-cost-value">${project.costRange}</span>
                        </div>
                        <button class="btn ${locked ? 'btn-secondary' : 'btn-details'}" data-id="${project.id}" ${locked ? 'disabled style="cursor:not-allowed;"' : ''}>Ver Projeto <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(card);
        });

        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = btn.getAttribute('data-id');
                openProjectModal(projectId);
            });
        });
    }

    // Inicializar os projetos e progresso
    renderProjects();
    updateProgressDashboard();

    // Eventos de Filtragem
    budgetSelect.addEventListener('change', () => {
        renderProjects();
        renderKanban();
    });
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-category');
            renderProjects();
            renderKanban();
        });
    });

    // ----------------------------------------------------------------------
    // 4. LOGICA DO MODAL DE DETALHES DE PROJETO
    // ----------------------------------------------------------------------
    const modal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalDetails = document.getElementById('modal-project-details');

    function openProjectModal(id) {
        const p = projects.find(proj => proj.id === id);
        if (!p) return;

        const materialsList = p.materials.map(m => `<li>${m}</li>`).join('');
        const stepsList = p.steps.map(s => `<li>${s}</li>`).join('');
        const cvBullets = p.curriculum.bullets.map(b => `<li>${b}</li>`).join('');

        const currentStatus = localStorage.getItem('engnav_status_' + p.id) || 'not-started';
        const currentNotes = localStorage.getItem('engnav_notes_' + p.id) || '';
        const rawChangelog = localStorage.getItem('engnav_changelog_' + p.id) || '[]';
        const changelog = JSON.parse(rawChangelog);

        let changelogHtml = '';
        if (changelog.length > 0) {
            changelogHtml = `
                <div class="modal-section" style="margin-top:1.5rem;">
                    <h3><i class="fa-solid fa-history"></i> Histórico de Mudanças (Changelog)</h3>
                    <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
                        ${changelog.map(c => `<li style="border-left: 2px solid var(--accent); padding-left: 0.75rem; color: var(--text-secondary);"><span style="font-weight:600; color:var(--text-primary);">${c.date}</span>: ${c.text} (Status: ${c.status})</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        modalDetails.innerHTML = `
            <div class="modal-title-area">
                <h2>${p.title}</h2>
                <p class="text-accent font-bold"><i class="fa-solid fa-microchip"></i> Categoria: ${p.category.toUpperCase()}</p>
            </div>
            
            <div class="modal-meta-grid">
                <div class="modal-meta-item">
                    <span class="modal-meta-label">Faixa de Custo</span>
                    <span class="modal-meta-value text-accent">${p.costRange}</span>
                </div>
                <div class="modal-meta-item">
                    <span class="modal-meta-label">Dificuldade</span>
                    <span class="modal-meta-value">${p.difficulty}</span>
                </div>
                <div class="modal-meta-item">
                    <span class="modal-meta-label">Tempo Estimado</span>
                    <span class="modal-meta-value">${p.time}</span>
                </div>
            </div>

            <!-- Seção de Acompanhamento de Status e Anotações -->
            <div class="modal-status-section">
                <div class="modal-status-row">
                    <div class="status-dropdown-wrapper">
                        <label for="modal-status-select" class="font-bold"><i class="fa-solid fa-spinner"></i> Status do Projeto:</label>
                        <select id="modal-status-select" class="status-select">
                            <option value="not-started" ${currentStatus === 'not-started' ? 'selected' : ''}>Não Iniciado</option>
                            <option value="in-progress" ${currentStatus === 'in-progress' ? 'selected' : ''}>Em Execução</option>
                            <option value="completed" ${currentStatus === 'completed' ? 'selected' : ''}>Concluído</option>
                        </select>
                    </div>
                    <div class="modal-actions-bar">
                        <button id="modal-pdf-btn" class="btn btn-accent btn-small" style="display: ${currentStatus === 'completed' ? 'inline-flex' : 'none'};"><i class="fa-solid fa-file-pdf"></i> Gerar Relatório (PDF)</button>
                    </div>
                </div>
                <div class="notes-area-wrapper">
                    <label for="modal-notes-textarea" class="font-bold"><i class="fa-solid fa-note-sticky"></i> Minhas Anotações, Componentes Alternativos & Mudanças:</label>
                    <textarea id="modal-notes-textarea" class="notes-textarea" placeholder="Descreva componentes alternativos de sucata ou mudanças de projeto...">${currentNotes}</textarea>
                </div>
                <div class="modal-actions-bar" style="margin-top: 10px;">
                    <button id="modal-save-btn" class="btn btn-primary btn-small"><i class="fa-solid fa-floppy-disk"></i> Salvar Progresso</button>
                </div>
            </div>

            <div class="modal-section">
                <h3><i class="fa-solid fa-circle-info"></i> Descrição Operacional</h3>
                <p>${p.desc}</p>
            </div>

            <div class="modal-section">
                <h3><i class="fa-solid fa-list"></i> Lista de Materiais & Orçamento BR</h3>
                <ul>${materialsList}</ul>
            </div>

            <div class="modal-section">
                <h3><i class="fa-solid fa-screwdriver-wrench"></i> Instruções de Montagem</h3>
                <ol>${stepsList}</ol>
            </div>

            <div class="modal-section">
                <h3><i class="fa-solid fa-code"></i> Código Base Sugerido</h3>
                <pre><code>${escapeHtml(p.code)}</code></pre>
            </div>

            <div class="curriculum-box">
                <h4><i class="fa-solid fa-award"></i> ${p.curriculum.title}</h4>
                <p>${p.curriculum.desc}</p>
                <ul>${cvBullets}</ul>
            </div>

            ${changelogHtml}
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        const statusSelect = document.getElementById('modal-status-select');
        const pdfBtn = document.getElementById('modal-pdf-btn');
        const notesTextarea = document.getElementById('modal-notes-textarea');
        const saveBtn = document.getElementById('modal-save-btn');

        statusSelect.addEventListener('change', (e) => {
            pdfBtn.style.display = e.target.value === 'completed' ? 'inline-flex' : 'none';
        });

        saveBtn.addEventListener('click', () => {
            const newStatus = statusSelect.value;
            const newNotes = notesTextarea.value;
            const prevStatus = localStorage.getItem('engnav_status_' + p.id) || 'not-started';
            
            localStorage.setItem('engnav_status_' + p.id, newStatus);
            localStorage.setItem('engnav_notes_' + p.id, newNotes);
            
            // Add automatic changelog if status or notes changed
            if (newStatus !== prevStatus) {
                const dateStr = new Date().toLocaleString('pt-BR');
                const statusTranslations = { 'not-started': 'Não Iniciado', 'in-progress': 'Em Execução', 'completed': 'Concluído' };
                const text = `Mudança de status de "${statusTranslations[prevStatus]}" para "${statusTranslations[newStatus]}"`;
                const item = { date: dateStr, text: text, status: statusTranslations[newStatus] };
                
                changelog.push(item);
                localStorage.setItem('engnav_changelog_' + p.id, JSON.stringify(changelog));
            }
            
            saveBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Salvo!`;
            saveBtn.style.background = 'linear-gradient(135deg, var(--accent), #059669)';
            
            setTimeout(() => {
                saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Salvar Progresso`;
                saveBtn.style.background = '';
            }, 1500);

            renderProjects();
            renderKanban();
            updateProgressDashboard();
        });

        pdfBtn.addEventListener('click', () => {
            generateProjectPDF(p);
        });
    }

    function generateProjectPDF(project) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const notes = localStorage.getItem('engnav_notes_' + project.id) || 'Nenhuma anotação registrada.';
        const dateStr = new Date().toLocaleDateString('pt-BR');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(6, 182, 212);
        doc.text("EngNav - Relatório de Conclusão", 20, 25);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text("Plataforma de Desenvolvimento e Aceleração de Carreira", 20, 31);
        
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(project.title, 20, 45);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Categoria:", 20, 55);
        doc.setFont("helvetica", "normal");
        doc.text(project.category.toUpperCase(), 45, 55);

        doc.text("Dificuldade: " + project.difficulty, 20, 61);
        doc.text("Tempo Estimado: " + project.time, 20, 67);
        doc.text("Faixa de Custo: " + project.costRange, 110, 55);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(16, 185, 129);
        doc.text("STATUS: CONCLUÍDO", 110, 61);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "normal");
        doc.text("Concluído em: " + dateStr, 110, 67);

        doc.line(20, 73, 190, 73);

        doc.setFont("helvetica", "bold");
        doc.text("1. Descrição do Projeto", 20, 81);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(project.desc, 170);
        doc.text(descLines, 20, 87);
        
        let y = 87 + (descLines.length * 5) + 6;

        doc.setFont("helvetica", "bold");
        doc.text("2. Materiais e Componentes Utilizados", 20, y);
        doc.setFont("helvetica", "normal");
        y += 6;
        project.materials.forEach(m => {
            doc.text("• " + m, 22, y);
            y += 5;
        });

        y += 4;
        doc.setFont("helvetica", "bold");
        doc.text("3. Relatório de Adaptações e Soluções de Baixo Custo", 20, y);
        doc.setFont("helvetica", "normal");
        y += 6;
        const notesLines = doc.splitTextToSize(notes, 170);
        doc.text(notesLines, 20, y);
        y += (notesLines.length * 5) + 6;

        doc.setFont("helvetica", "bold");
        doc.text("4. Competências Destacáveis no Currículo", 20, y);
        doc.setFont("helvetica", "normal");
        y += 6;
        project.curriculum.bullets.forEach(b => {
            const clean = b.replace(/\*\*/g, '');
            const bulletLines = doc.splitTextToSize("- " + clean, 170);
            doc.text(bulletLines, 20, y);
            y += (bulletLines.length * 5);
        });

        y += 10;
        if (y > 260) { doc.addPage(); y = 30; }

        doc.setDrawColor(6, 182, 212);
        doc.setLineWidth(0.8);
        doc.setFillColor(248, 250, 252);
        doc.rect(20, y, 170, 20);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(6, 182, 212);
        doc.text("VALIDADO PELO COMPROVANTE DE PORTFÓLIO ENGNAV", 26, y + 8);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Relatório oficial de validação de projetos de mecatrônica e engenharia integrada.", 26, y + 14);

        doc.save(`Relatorio_EngNav_${project.id}.pdf`);
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // ----------------------------------------------------------------------
    // 5. ANÁLISE DE COMPETÊNCIAS (GAP FINDER)
    // ----------------------------------------------------------------------
    const jobRequirements = {
        automacao_ind: {
            name: 'Engenheiro de Automação e Controle Jr',
            required: ['cpp', 'arduino', 'clp', 'scada', 'pid'],
            niceToHave: ['python', 'git', 'cad', 'hidraulica'],
            roadmap: {
                phase1: 'Fase 1 (Dias 1-30): Fundamentos de CLPs e Ladder. Pratique simulando no CODESYS (software gratuito industrial). Paralelamente, domine montagem de painéis elétricos simples e contatores.',
                phase2: 'Fase 2 (Dias 31-60): Conectividade Industrial. Integre o ESP32 usando protocolo Modbus IP com supervisórios como o ScadaBR. Entenda variáveis de Holding Registers e Coils.',
                phase3: 'Fase 3 (Dias 61-90): Sintonia Industrial. Pratique controle em malha fechada. Desenvolva o projeto "Controlador Térmico PID" de baixo custo e registre as curvas de resposta no currículo.'
            }
        },
        mecanico_des: {
            name: 'Engenheiro de Desenvolvimento Mecânico (P&D)',
            required: ['cad', 'fea', 'python', 'git'],
            niceToHave: ['cpp', 'arduino', 'pid', 'hidraulica'],
            roadmap: {
                phase1: 'Fase 1 (Dias 1-30): Modelagem Avançada em CAD. Obtenha a certificação gratuita CSWA da SolidWorks ou treine modelagem de peças complexas com tolerâncias geométricas no Onshape.',
                phase2: 'Fase 2 (Dias 31-60): Simulação Numérica (FEA). Aprenda conceitos de malha, condições de contorno e análise estática linear. Utilize ferramentas open source de FEA como o FreeCAD ou SimScale.',
                phase3: 'Fase 3 (Dias 61-90): Mecânica Integrada (Mecatrônica). Crie um portfólio no GitHub documentando os cálculos de torque de motores para o projeto do "Braço Robótico" e poste as simulações em CAD.'
            }
        },
        sistemas_emb: {
            name: 'Engenheiro de Sistemas Embarcados / IoT',
            required: ['cpp', 'arduino', 'esp32', 'git', 'python'],
            niceToHave: ['cad', 'pid', 'scada'],
            roadmap: {
                phase1: 'Fase 1 (Dias 1-30): Programação Estruturada em C++ e Ponteiros. Pratique lógica de programação e depuração direta em hardware de baixo custo como o Arduino Nano.',
                phase2: 'Fase 2 (Dias 31-60): Conectividade Sem Fio e MQTT. Use o ESP32 para enviar dados de sensores para corretores de mensagens MQTT (como Mosquitto) e monte painéis simples no Node-RED.',
                phase3: 'Fase 3 (Dias 61-90): Otimização de Consumo (Baterias). Crie o projeto "Estação Climatológica IoT" aplicando modos Deep Sleep do ESP32 para demonstrar proficiência em projetos móveis profissionais.'
            }
        },
        manutencao_pred: {
            name: 'Engenheiro de Confiabilidade / Manutenção Preditiva',
            required: ['python', 'git', 'arduino', 'esp32', 'hidraulica'],
            niceToHave: ['cad', 'clp', 'scada'],
            roadmap: {
                phase1: 'Fase 1 (Dias 1-30): Manipulação de Dados com Python. Faça cursos gratuitos de NumPy, Pandas e Matplotlib para aprender a tratar dados de sensores industriais e criar gráficos.',
                phase2: 'Fase 2 (Dias 31-60): Aquisição de Dados de Sensores de Vibração. Desenvolva o projeto "SCADA IoT de Baixo Custo" integrando o acelerômetro MPU6050 ao ESP32.',
                phase3: 'Fase 3 (Dias 61-90): Algoritmos de Detecção de Falhas. Use Python para analisar dados históricos de vibração e temperatura coletados, criando alertas automáticos de desvio (Manutenção Preditiva).'
            }
        }
    };

    const analyzeBtn = document.getElementById('analyze-btn');
    const roadmapContainer = document.getElementById('roadmap-container');
    const exportRoadmapBtn = document.getElementById('export-roadmap-btn');
    
    let lastAnalysis = null;

    analyzeBtn.addEventListener('click', () => {
        const checkedSkills = [];
        document.querySelectorAll('.skill-checkbox:checked').forEach(chk => {
            checkedSkills.push(chk.value);
        });

        const targetJobKey = document.getElementById('target-job').value;
        const job = jobRequirements[targetJobKey];
        if (!job) return;

        const totalReq = job.required.length;
        let matchedReq = 0;
        const missingReq = [];

        job.required.forEach(skill => {
            if (checkedSkills.includes(skill)) matchedReq++;
            else missingReq.push(skill);
        });

        const percent = Math.round((matchedReq / totalReq) * 100);

        const skillNamesTranslation = {
            python: 'Python (Análise de Dados)',
            cpp: 'Programação C++ (Hardware)',
            matlab: 'MATLAB / GNU Octave',
            git: 'Git & Versionamento no GitHub',
            arduino: 'Eletrônica e Prototipagem Arduino',
            esp32: 'Desenvolvimento IoT e ESP32',
            clp: 'CLP / Programação Ladder',
            scada: 'Arquiteturas SCADA e Supervisórios',
            cad: 'Modelagem Paramétrica CAD 3D',
            fea: 'Simulação Estrutural por Elementos Finitos (FEA)',
            pid: 'Sintonia de Controle Analógico PID',
            hidraulica: 'Sistemas Hidráulicos & Pneumáticos'
        };

        const missingTagsHtml = missingReq.map(skill => `<span class="missing-tag">${skillNamesTranslation[skill] || skill}</span>`).join('');

        let missingSection = '';
        if (missingReq.length > 0) {
            missingSection = `
                <div class="missing-skills-box">
                    <h4><i class="fa-solid fa-triangle-exclamation"></i> Competências Técnicas Críticas em Falta:</h4>
                    <div class="missing-tags">${missingTagsHtml}</div>
                </div>
            `;
        } else {
            missingSection = `
                <div class="missing-skills-box" style="background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.2);">
                    <h4 style="color: var(--accent);"><i class="fa-solid fa-circle-check"></i> Você possui todas as habilidades essenciais exigidas para esta vaga.</h4>
                </div>
            `;
        }

        roadmapContainer.innerHTML = `
            <h2><i class="fa-solid fa-route text-accent"></i> Seu Roadmap: ${job.name}</h2>
            
            <div class="roadmap-results">
                <div class="compatibility-score-box">
                    <div class="score-circle">${percent}%</div>
                    <div class="score-text">
                        <h4>Afinidade com a vaga alvo</h4>
                        <p>Você preenche ${matchedReq} de ${totalReq} competências fundamentais.</p>
                    </div>
                </div>

                ${missingSection}

                <div class="roadmap-timeline mt-3">
                    <div class="timeline-phase active">
                        <h5>Fase 1: Conhecimento Base (Dias 1 a 30)</h5>
                        <p>${job.roadmap.phase1}</p>
                    </div>
                    <div class="timeline-phase">
                        <h5>Fase 2: Conexão e Portfólio (Dias 31 a 60)</h5>
                        <p>${job.roadmap.phase2}</p>
                    </div>
                    <div class="timeline-phase">
                        <h5>Fase 3: Refinamento Técnico (Dias 61 a 90)</h5>
                        <p>${job.roadmap.phase3}</p>
                    </div>
                </div>
            </div>
        `;

        lastAnalysis = {
            jobName: job.name,
            percent: percent,
            matched: matchedReq,
            total: totalReq,
            missing: missingReq.map(s => skillNamesTranslation[s] || s),
            phases: job.roadmap
        };

        exportRoadmapBtn.style.display = 'inline-flex';
    });

    exportRoadmapBtn.addEventListener('click', () => {
        if (!lastAnalysis) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(6, 182, 212);
        doc.text("Plano de Estudos Acelerado", 20, 25);

        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`Vaga Alvo: ${lastAnalysis.jobName}`, 20, 37);
        doc.text(`Afinidade: ${lastAnalysis.percent}% (${lastAnalysis.matched} de ${lastAnalysis.total} competências)`, 20, 44);

        doc.line(20, 49, 190, 49);

        let y = 58;
        if (lastAnalysis.missing.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.text("Lacunas Técnicas Identificadas:", 20, y);
            doc.setFont("helvetica", "normal");
            y += 7;
            lastAnalysis.missing.forEach(m => {
                doc.text("• " + m, 22, y);
                y += 6;
            });
            y += 4;
        }

        doc.setFont("helvetica", "bold");
        doc.text("Cronograma de 90 Dias:", 20, y);
        doc.setFont("helvetica", "normal");
        y += 7;

        const p1 = doc.splitTextToSize("Fase 1 (Dias 1-30): " + lastAnalysis.phases.phase1, 170);
        doc.text(p1, 20, y);
        y += (p1.length * 5) + 6;

        const p2 = doc.splitTextToSize("Fase 2 (Dias 31-60): " + lastAnalysis.phases.phase2, 170);
        doc.text(p2, 20, y);
        y += (p2.length * 5) + 6;

        const p3 = doc.splitTextToSize("Fase 3 (Dias 61-90): " + lastAnalysis.phases.phase3, 170);
        doc.text(p3, 20, y);
        
        doc.save("Roadmap_Carreira_EngNav.pdf");
    });

    // ----------------------------------------------------------------------
    // 6. APRENDIZAGEM & LIVROS (NOVA ABA EXTRA)
    // ----------------------------------------------------------------------
    const addSkillBtn = document.getElementById('add-skill-btn');
    const newSkillNameInput = document.getElementById('new-skill-name');
    const newSkillTypeSelect = document.getElementById('new-skill-type');
    const hardSkillsList = document.getElementById('hard-skills-list');
    const softSkillsList = document.getElementById('soft-skills-list');

    const defaultHardSkills = [
        { name: "Modelagem CAD 3D (SolidWorks/Inventor)", type: "hard", level: 85, notes: "Experiência em Konvex Jr." },
        { name: "Programação C/C++ (Arduino/ESP32)", type: "hard", level: 75, notes: "Projetos no GERM" },
        { name: "Sintonia de Controle PID", type: "hard", level: 70, notes: "Bancadas do SENAI" },
        { name: "Lógica Ladder e CLPs Industriais", type: "hard", level: 65, notes: "Módulo I do SENAI" },
        { name: "Simulação por Elementos Finitos (FEA)", type: "hard", level: 60, notes: "Estudos de vigas e treliças" }
    ];

    const defaultSoftSkills = [
        { name: "Gestão de Projetos & Liderança", type: "soft", level: 80, notes: "Ex-Diretor da Konvex Jr." },
        { name: "Resolução de Problemas Complexos", type: "soft", level: 75, notes: "Desafios de robótica" },
        { name: "Trabalho em Equipe", type: "soft", level: 85, notes: "Atividades no GERM" },
        { name: "Comunicação Técnica", type: "soft", level: 70, notes: "Apresentação de relatórios" }
    ];

    let userSkills = JSON.parse(localStorage.getItem('engnav_user_skills')) || [...defaultHardSkills, ...defaultSoftSkills];

    function saveSkills() {
        localStorage.setItem('engnav_user_skills', JSON.stringify(userSkills));
    }

    function renderSkills() {
        hardSkillsList.innerHTML = '';
        softSkillsList.innerHTML = '';

        userSkills.forEach((skill, idx) => {
            const item = document.createElement('div');
            item.className = 'skill-manage-item card glass';
            item.style.padding = '10px';
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.gap = '0.5rem';

            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:600;">${skill.name}</span>
                    <button class="btn btn-small btn-danger delete-skill-btn" data-index="${idx}" style="padding:0.25rem 0.5rem; background:#ef4444;"><i class="fa-solid fa-trash"></i></button>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="range" class="skill-level-slider" data-index="${idx}" min="0" max="100" value="${skill.level}" style="flex:1;">
                    <span style="font-weight:700; min-width:40px; text-align:right;">${skill.level}%</span>
                </div>
                <input type="text" class="skill-notes-input" data-index="${idx}" value="${skill.notes || ''}" placeholder="Notas/Observações pessoais..." style="padding:4px 8px; font-size:0.8rem; background:rgba(0,0,0,0.2); border:1px solid var(--border); border-radius:4px; color:var(--text-primary);">
            `;

            if (skill.type === 'hard') {
                hardSkillsList.appendChild(item);
            } else {
                softSkillsList.appendChild(item);
            }
        });

        // Add Listeners
        document.querySelectorAll('.delete-skill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                userSkills.splice(idx, 1);
                saveSkills();
                renderSkills();
            });
        });

        document.querySelectorAll('.skill-level-slider').forEach(slider => {
            slider.addEventListener('change', (e) => {
                const idx = parseInt(slider.getAttribute('data-index'));
                userSkills[idx].level = parseInt(e.target.value);
                saveSkills();
                renderSkills();
            });
        });

        document.querySelectorAll('.skill-notes-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const idx = parseInt(input.getAttribute('data-index'));
                userSkills[idx].notes = e.target.value;
                saveSkills();
            });
        });
    }

    addSkillBtn.addEventListener('click', () => {
        const name = newSkillNameInput.value.trim();
        const type = newSkillTypeSelect.value;
        if (!name) return;

        userSkills.push({ name: name, type: type, level: 50, notes: '' });
        newSkillNameInput.value = '';
        saveSkills();
        renderSkills();
    });

    renderSkills();

    // ── Biblioteca de Livros Técnicos ──
    const addBookForm = document.getElementById('add-book-form');
    const newBookTitle = document.getElementById('new-book-title');
    const newBookAuthor = document.getElementById('new-book-author');
    const newBookArea = document.getElementById('new-book-area');
    const booksListContainer = document.getElementById('books-list');

    const defaultBooks = [
        { title: "Engenharia de Controle Moderno", author: "Katsuhiko Ogata", area: "Controle", projects: "P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11" },
        { title: "Fundamentos da Termodinâmica", author: "Borgnakke & Sonntag", area: "Mecânica", projects: "P01, P04, P06, P09, P20" },
        { title: "Eletrônica (Vol. 1)", author: "Albert Malvino & David Bates", area: "Eletrônica", projects: "P01-P05" },
        { title: "Projeto de Máquinas", author: "Joseph E. Shigley", area: "Mecânica", projects: "P16, P17, P18, P19, P20, P22" },
        { title: "Resistência dos Materiais", author: "R. C. Hibbeler", area: "Mecânica", projects: "P16, P17, P19" },
        { title: "Automate the Boring Stuff with Python", author: "Al Sweigart", area: "Programação", projects: "P21-P25" },
        { title: "IoT Fundamentals", author: "David Hanes et al. (Cisco)", area: "IoT", projects: "P11-P17" },
        { title: "Introduction to Robotics: Mechanics and Control", author: "John J. Craig", area: "Robótica", projects: "P06, P07, P08, P10, P30" },
        { title: "Automação Industrial", author: "Cicero Moraes & Plinio Castrucci", area: "Automação", projects: "P11, P12, P16, P17, P26, P29, P30" },
        { title: "Python for Data Analysis", author: "Wes McKinney", area: "Programação", projects: "P21, P22, P23, P24, P25, P26, P28" }
    ];

    let userBooks = JSON.parse(localStorage.getItem('engnav_user_books')) || defaultBooks;

    function saveBooks() {
        localStorage.setItem('engnav_user_books', JSON.stringify(userBooks));
    }

    function renderBooks() {
        booksListContainer.innerHTML = '';
        userBooks.forEach((book, idx) => {
            const div = document.createElement('div');
            div.className = 'book-card card glass';
            div.style.padding = '12px';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            
            div.innerHTML = `
                <div>
                    <h4 style="margin:0; font-size:1rem; font-weight:600;">${book.title}</h4>
                    <p style="margin:2px 0 0 0; font-size:0.85rem; color:var(--text-secondary);">${book.author} · <span class="badge" style="background:var(--accent-subtle); color:var(--accent); font-size:0.7rem; padding:1px 6px;">${book.area}</span></p>
                    <p style="margin:4px 0 0 0; font-size:0.75rem; color:var(--text-muted);"><i class="fa-solid fa-link"></i> Projetos Relacionados: ${book.projects || 'Vários'}</p>
                </div>
                <button class="btn btn-small btn-danger delete-book-btn" data-index="${idx}" style="padding:0.3rem 0.6rem; background:#ef4444;"><i class="fa-solid fa-trash"></i></button>
            `;
            booksListContainer.appendChild(div);
        });

        document.querySelectorAll('.delete-book-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                userBooks.splice(idx, 1);
                saveBooks();
                renderBooks();
            });
        });
    }

    addBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = newBookTitle.value.trim();
        const author = newBookAuthor.value.trim();
        const area = newBookArea.value;

        if (!title || !author) return;

        userBooks.unshift({ title: title, author: author, area: area, projects: 'Geral' });
        newBookTitle.value = '';
        newBookAuthor.value = '';
        saveBooks();
        renderBooks();
    });

    renderBooks();

    // ----------------------------------------------------------------------
    // 7. MODO KANBAN PARA PROJETOS
    // ----------------------------------------------------------------------
    const viewGridBtn = document.getElementById('view-grid-btn');
    const viewKanbanBtn = document.getElementById('view-kanban-btn');
    const kanbanContainer = document.getElementById('kanban-container');

    viewGridBtn.addEventListener('click', () => {
        viewGridBtn.classList.add('active');
        viewKanbanBtn.classList.remove('active');
        projectsContainer.style.display = 'grid';
        kanbanContainer.style.display = 'none';
    });

    viewKanbanBtn.addEventListener('click', () => {
        viewKanbanBtn.classList.add('active');
        viewGridBtn.classList.remove('active');
        projectsContainer.style.display = 'none';
        kanbanContainer.style.display = 'flex';
        renderKanban();
    });

    function renderKanban() {
        const columns = {
            'not-started': document.getElementById('kanban-not-started'),
            'in-progress': document.getElementById('kanban-in-progress'),
            'completed': document.getElementById('kanban-completed')
        };

        // Clear columns
        for (let k in columns) columns[k].innerHTML = '';

        const maxBudget = budgetSelect.value;
        const filtered = projects.filter(p => {
            const matchesCategory = (activeCategory === 'todos' || p.category === activeCategory);
            const matchesBudget = (maxBudget === 'all' || p.cost <= parseInt(maxBudget));
            return matchesCategory && matchesBudget;
        });

        const counts = { 'not-started': 0, 'in-progress': 0, 'completed': 0 };

        filtered.forEach(p => {
            const status = localStorage.getItem('engnav_status_' + p.id) || 'not-started';
            counts[status]++;

            const card = document.createElement('div');
            card.className = 'kanban-card card glass';
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-id', p.id);
            card.style.cursor = 'grab';
            card.style.margin = '10px 0';
            card.style.padding = '12px';

            const locked = isProjectLocked(p);
            if (locked) {
                card.style.opacity = '0.6';
                card.setAttribute('draggable', 'false');
                card.style.cursor = 'not-allowed';
            }

            card.innerHTML = `
                <h4 style="margin:0 0 5px 0; font-size:0.95rem; font-weight:600;">${locked ? '<i class="fa-solid fa-lock" style="font-size:0.8rem; margin-right:4px;"></i>' : ''}${p.title}</h4>
                <p style="margin:0; font-size:0.75rem; color:var(--text-secondary);">${p.shortDesc}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                    <span style="font-size:0.7rem; background:rgba(255,255,255,0.05); padding:1px 5px; border-radius:4px;">${p.difficulty}</span>
                    <span style="font-size:0.75rem; font-weight:600; color:var(--accent);">${p.costRange}</span>
                </div>
            `;

            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', p.id);
                card.style.cursor = 'grabbing';
            });

            card.addEventListener('click', () => {
                if (!locked) openProjectModal(p.id);
            });

            if (columns[status]) {
                columns[status].appendChild(card);
            }
        });

        document.getElementById('count-not-started').innerText = counts['not-started'];
        document.getElementById('count-in-progress').innerText = counts['in-progress'];
        document.getElementById('count-completed').innerText = counts['completed'];
    }

    // Global drag & drop callback helpers
    window.handleDrop = function(e, targetStatus) {
        e.preventDefault();
        const projectId = e.dataTransfer.getData('text/plain');
        if (!projectId) return;

        const p = projects.find(proj => proj.id === projectId);
        if (!p || isProjectLocked(p)) return;

        const prevStatus = localStorage.getItem('engnav_status_' + p.id) || 'not-started';
        if (prevStatus === targetStatus) return;

        localStorage.setItem('engnav_status_' + p.id, targetStatus);
        
        // Save automatic changelog on drag drop
        const rawChangelog = localStorage.getItem('engnav_changelog_' + p.id) || '[]';
        const changelog = JSON.parse(rawChangelog);
        const dateStr = new Date().toLocaleString('pt-BR');
        const statusTranslations = { 'not-started': 'Não Iniciado', 'in-progress': 'Em Execução', 'completed': 'Concluído' };
        const text = `Mudança de status via Kanban para "${statusTranslations[targetStatus]}"`;
        changelog.push({ date: dateStr, text: text, status: statusTranslations[targetStatus] });
        localStorage.setItem('engnav_changelog_' + p.id, JSON.stringify(changelog));

        renderProjects();
        renderKanban();
        updateProgressDashboard();
    };

    // ----------------------------------------------------------------------
    // 8. SIMULADOR DE CHATBOT MENTOR DE IA
    // ----------------------------------------------------------------------
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const faqButtons = document.querySelectorAll('.faq-btn');

    const mentorKnowledge = {
        curriculo: `**Como colocar projetos pessoais no currículo:**\n\n1. **Evite jargões escolares:** Não chame de "trabalho acadêmico" ou "laboratório". Dê títulos corporativos: *ex. "Desenvolvimento de Protótipo Computacional de CFD"* ou *ex. "Integração de Rede de Monitoramento IIoT com ESP32"*.\n2. **Use a Estrutura STAR:**\n   - **S**ituação: Qual era o problema mecânico ou controle?\n   - **T**arefa: O que você planejou fazer?\n   - **A**ção: Ferramentas utilizadas (ESP32, Protocolo Modbus, C++, Python)\n   - **R**esultado: Qual foi o impacto ou precisão do sistema.\n3. **Coloque links de portfólio:** Insira links clicáveis do GitHub para os códigos ou vídeos rápidos no LinkedIn.`,
        
        programacao: `**Linguagens obrigatórias hoje para Engenharia Mecânica no Brasil:**\n\n1. **Python:** É a linguagem mais comum em engenharia hoje. Usada para análise de dados, cálculo matricial (alternativa gratuita ao MATLAB usando NumPy/SciPy), inteligência artificial (manutenção preditiva) e testes de componentes.\n2. **C++ (Arduino/ESP32):** Indispensável para mecatrônica, automação e robótica. Entender como gerenciar memória, ler entradas analógicas e escrever rotinas de controle de tempo real.\n3. **Lógica Ladder:** Embora não seja uma linguagem de computador padrão, é a linguagem dos CLPs industriais. Essencial se você quer trabalhar na indústria de manufatura ou química integrada.`,
        
        transicao: `**Transição de Engenharia Mecânica Pura para Automação:**\n\nA engenharia de controle e automação é, na verdade, uma evolução direta da engenharia mecânica dinâmica.\n* **Aproveite sua base física:** Você já entende forças, momentos, termodinâmica e fluidos. O controle simplesmente age *sobre* estes sistemas físicos.\n* **Passos recomendados:**\n  1. Compre um Kit de Arduino/ESP32 básico de baixo custo.\n  2. Implemente sensores de temperatura ou posição nos seus conhecimentos mecânicos.\n  3. Estude sintonia PID (Proporcional-Integral-Derivativo) - isso conecta diretamente a matemática da faculdade com atuadores práticos.\n  4. Aprenda redes industriais (Modbus, OPC UA) e CLPs.`,
        
        cursos: `**Plataformas de Cursos Gratuitos e Certificações na Área:**\n\n1. **SENAI:** Referência nacional absoluta. Possui excelentes cursos rápidos e de baixo custo/gratuitos em automação industrial, eletropneumática e CLP.\n2. **Coursera / edX:** Procure por cursos gratuitos (modo ouvinte) de universidades internacionais sobre "Control Systems", "Introduction to Systems Engineering" ou "Robotics".\n3. **Plataformas de Fabricantes:** \n   - *Festo Didactic:* Material de alta qualidade sobre hidráulica e pneumática.\n   - *Siemens / Rockwell Automation:* Cursos e certificações gratuitas nas ferramentas de CLP e IHM deles.`
    };

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        const avatarIcon = sender === 'assistant' ? 'fa-robot' : 'fa-user';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fa-solid ${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <p>${formatMarkdown(text)}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatMarkdown(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\* (.*?)/g, '• $1');
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message assistant typing-container';
        indicator.innerHTML = `
            <div class="message-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }

    function generateResponse(userText) {
        const lowerText = userText.toLowerCase();
        let response = '';
        if (lowerText.includes('currículo') || lowerText.includes('curriculo') || lowerText.includes('linkedin') || lowerText.includes('portfólio')) {
            response = mentorKnowledge.curriculo;
        } else if (lowerText.includes('programação') || lowerText.includes('programacao') || lowerText.includes('python') || lowerText.includes('c++')) {
            response = mentorKnowledge.programacao;
        } else if (lowerText.includes('transição') || lowerText.includes('transicao') || lowerText.includes('automação') || lowerText.includes('automacao')) {
            response = mentorKnowledge.transicao;
        } else if (lowerText.includes('curso') || lowerText.includes('certificação') || lowerText.includes('gratuito') || lowerText.includes('plataforma')) {
            response = mentorKnowledge.cursos;
        } else {
            response = `Pergunta interessante sobre o mercado! A engenharia integrada no Brasil demanda muito esse perfil dinâmico de automação + mecânica. Para se posicionar:\n\n1. Construa projetos com lógica matemática e de controle real (PID, LQR, Kalman).\n2. Crie repositórios organizados no GitHub documentando e explicando sua montagem.\n3. Aproveite os canais do SENAI e as documentações dos fabricantes de CLP.\n\nUse um dos botões da barra lateral para perguntas específicas!`;
        }

        const typingIndicator = showTypingIndicator();
        setTimeout(() => {
            typingIndicator.remove();
            addMessage('assistant', response);
        }, 1200);
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;
        addMessage('user', text);
        chatInput.value = '';
        generateResponse(text);
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.getAttribute('data-question');
            handleSend();
        });
    });
});
