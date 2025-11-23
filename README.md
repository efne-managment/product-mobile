# 📱 App Nova Esperança

Este é o repositório oficial do **App Nova Esperança**, um aplicativo mobile desenvolvido com **Expo**, **React Native** e **Firebase**, com o objetivo de facilitar o gerenciamento da **Escolinha de Futebol Nova Esperança**, um projeto social sem fins lucrativos.

---

## 🚀 Tecnologias Utilizadas

- **[Expo](https://expo.dev/)**
- **React Native**
- **TypeScript**
- **Firebase (Authentication, Firestore Database, Storage)**

---

## 🔧 Funcionalidades do App

- Cadastro e gerenciamento de atletas
- Organização por categorias
- Controle de frequência nos treinos
- Gerenciamento de estoque
- Controle de entradas e saídas financeiras
- Autenticação de usuários

---

## 📦 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)
- Um emulador Android/iOS ou o aplicativo [Expo Go](https://expo.dev/client) no seu celular

---

## 🛠️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/fllaviacorreia/efne.git
cd efne
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn
```

### 3. Configure o Firebase

Crie um arquivo `.env` na raiz do projeto com suas credenciais do Firebase:

```
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

Certifique-se de que o projeto já está configurado no Firebase com:
- Authentication habilitada (Email/Password)
- Firestore Database
- Storage

### 4. Inicie o projeto

```bash
npx expo start
```

Escaneie o QR Code com o aplicativo Expo Go ou use um emulador.

---

---

## 🧪 Prototipação

O design e a prototipação do aplicativo foram feitos no Figma. Você pode visualizar o Design System e os protótipos através do link abaixo:

👉 [Acessar protótipo no Figma](https://www.figma.com/design/vuDFqQ9IPLHgE9ESbDUaLN/Design-System?node-id=0-1&p=f&t=BIg9tp7q5Rke4BK0-0)


## 📁 Estrutura do Projeto

```
📁 src/
├── components/
├── constants/
├── context/
├── firebase/
├── hooks/
├── navigation/
├── screens/
├── types/
└── validators/
```

---

## 👩‍💻 Contribuindo

Este projeto é de cunho social e colaborativo. Pull requests são bem-vindos!

---

## 🧑‍💻 Desenvolvido por

**Flávia Correia**  
[LinkedIn](https://www.linkedin.com/in/fllaviacorreia)

---

## 📃 Licença

Este projeto está licenciado sob a licença MIT.
