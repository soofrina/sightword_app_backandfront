# sw-frontend [![Netlify Build and Deploy](https://github.com/project-sight-words/sw-frontend/actions/workflows/netlify-deploy-frontend.yml/badge.svg)](https://github.com/project-sight-words/sw-frontend/actions/workflows/netlify-deploy-frontend.yml)

<p align="center">
  <a href="https://github.com/project-sight-words/" target="blank"><img src="https://avatars.githubusercontent.com/u/111692176?s=200&v=4/" width="200" style="border-radius: 30%;" alt="Project Sight Words Logo" /></a>
</p>

<p align="center">
  Frontend for Project Sight Words built using <a href="https://reactjs.org/" target="blank">Typescript React</a>.
</p>

# Table of contents

1. [Setting Up](#setting-up)
   1. [Prerequisites](#prerequisites)
   2. [Guide](#guide)
   3. [Setting up NVM on Windows](#nvm-windows)
   4. [Setting up NVM on Mac](#nvm-mac)
2. [Development](#development)
   1. [Starting up](#start-up)
   2. [Shutting down](#shut-down)
3. [Production Build](#production-build)
   1. [Serving the production build](#serve-build)
   2. [Updating build version number](#update-build-version)

## Setting Up <a name="setting-up"></a>

This section describes the process of setting up and running the frontend of Project Sight Words on your local computer.

### Prerequisites <a name="prerequisites"></a>

Before we begin the set up process, ensure that the following tools have been installed in your local computer.

- [Git](https://git-scm.com/): Version control system
- [Yarn](https://yarnpkg.com/): Package manager
- [Nvm](https://github.com/nvm-sh/nvm): Node Version Manager for Linux/Mac
- [Nvm Windows](https://github.com/coreybutler/nvm-windows): Node Version Manager for Windows

### Guide <a name="guide"></a>

1. Clone the repository into your local computer and change your working directory to the project's root folder.
   ```shell
   git clone https://github.com/project-sight-words/sw-frontend.git
   cd sw-frontend
   ```
2. Swap to the correct node version using NVM (See Guide Below).
   ```shell
   nvm use
   ```
3. Install the required packages using Yarn.
   ```shell
   yarn install
   ```

### Setting up NVM on Windows <a name="nvm-windows"></a>

If you have not set up NVM on your windows computer, you may follow these steps to set up NVM.

1. Uninstall Node on your computer, to ensure that it doesn't lead to errors when using different versions of Node.
2. Go to [nvm-windows-repository](https://github.com/coreybutler/nvm-windows) and click on Download Now.
3. Download `nvm-setup.exe`, and open the installer on your computer.
4. Verify that nvm has been installed correctly.
   ```shell
   nvm -v
   ```
5. The repository has a `.nvmrc` file which specifies the node version used by the project. To set your node version, open Windows PowerShell in administrator mode.
6. `cd` into the project directory in the administrator PowerShell window.
7. Run the following command:
   ```shell
   nvm use $(Get-Content .nvmrc)
   ```

### Setting up NVM on Mac <a name="nvm-mac"></a>

If you have not set up NVM on your mac computer, you may follow these steps to set up NVM.

Prerequisites - [Homebrew](https://brew.sh/)

1. Uninstall Node on your computer, to ensure that it doesn't lead to errors when using different versions of Node.
   ```shell
   brew uninstall --ignore-dependencies node
   brew uninstall --force node
   ```
2. Install nvm
   ```shell
   brew update
   brew install nvm
   ```
3. Next, create a directory for NVM at home
   ```shell
   mkdir ~/.nvm
   ```
4. Configure the required environment variables
   ```shell
   vim ~/.bash_profile # If you're Mac OS Catalina and Below
   vim ~/.zshrc # Otherwise
   ```
5. Add the below lines to the file
   ```
   export NVM_DIR=~/.nvm
   source $(brew --prefix nvm)/nvm.sh
   ```
6. Restart your terminal

## Development <a name="development"></a>

This section explains how to use this project on your local computer for development purposes.

### Starting up <a name="start-up"></a>

1. Ensure that you are in the root directory of the project on your computer.
2. Swap to the correct node version using NVM (See Guide Above).
   ```shell
   nvm use
   ```
3. Run the development server.
   ```shell
   yarn start
   ```

### Shutting down <a name="shut-down"></a>

1. To stop the development server, use Ctrl + C.

## Production Build <a name="production-build"></a>

Prerequisites - [serve](https://www.npmjs.com/package/serve)

### Serving the production build <a name="serve-build"></a>
1. To create a production build, run:
   ```shell
   yarn build
   ```
2. To serve the production build, run:
   ```shell
   serve -s build
   ```

### Updating build version number <a name="update-build-version"></a>
1. For releases with only bug fixes:
   ```shell
   yarn version --patch
   ```
2. For releases with new features with or without bug fixes:
   ```shell
   yarn version --minor
   ```
3. For major releases or breaking features:
   ```shell
   yarn version --major
   ```
