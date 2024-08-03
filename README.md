# Purchaseway Time Measure

Este é um aplicativo desenvolvido com Ionic, React, Capacitor e TypeScript que calcula o tempo entre dois intervalos fornecidos pelo usuário.

## Índice

- [Download](#download)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Capturas de Tela](#capturas-de-tela)
- [Solução de Problemas](#solução-de-problemas)
- [Capturas de Tela](#capturas-de-tela)
- [Licença](#licença)

## Download

Em breve.

## Funcionalidades

- Interface intuitiva para inserir os intervalos de tempo.
- Cálculo preciso do tempo decorrido entre os intervalos.
- Suporte para diferentes formatos de hora.
- Exibição clara do resultado em horas e minutos.

## Tecnologias Utilizadas

- **Ionic**: Framework para desenvolvimento de aplicativos híbridos.
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Capacitor**: Ferramenta para integração com funcionalidades nativas.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.

## Requisitos

- Node.js
- npm

## Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/KevinWillyan456/purchaseway-time-measure.git
   ```

2. Navegue até o diretório do projeto:

   ```sh
   cd purchaseway-time-measure
   ```

3. Instale as dependências:

   ```sh
   npm install
   ```

## Executando o Aplicativo

Para rodar o aplicativo em um navegador:

```sh
ionic serve
```

## Solução de Problemas

### Construir a Capa do Aplicativo

   ```sh
   npm install @capacitor/assets --save-dev && npx @capacitor/assets generate --iconBackgroundColor '#000000' --splashBackgroundColor '#000000' && npm uninstall @capacitor/assets && npm run app:build
   ```

### Consertar o Visual

Navegue até a pasta `android/app/src/main/res/values` do seu projeto Ionic e abra o arquivo `styles.xml`. Adicione as seguintes linhas de código dentro da tag `<style name="AppTheme.NoActionBar" parent="Theme.AppCompat.DayNight.NoActionBar">`

   ```xml
   <item name="android:background">@android:color/white</item>
   <item name="android:navigationBarColor">@android:color/white</item>
   <item name="android:windowFullscreen">true</item>
   ```

### Comandos de Build APK

   ```sh
   cd android/
   ```

   ```sh
   ./gradlew assembleDebug
   ```

## Capturas de Tela

![image-3](https://github.com/user-attachments/assets/f2cee5e7-8ae1-446b-a6f5-df92c235c3d3)
_Imagem 1_

![image-2](https://github.com/user-attachments/assets/8153d305-d1db-4df1-9947-d7fbec0a3c5c)
_Imagem 2_

![image](https://github.com/user-attachments/assets/fd9dc928-ffdd-42cf-945c-c1f01d3e7427)
_Imagem 3_

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Pw Animes © 2024. Todos os direitos reservados.

---

_Desenvolvido por [Kevin Souza](https://github.com/KevinWillyan456)._
