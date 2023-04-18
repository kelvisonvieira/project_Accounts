

//modulos externos
import inquirer from "inquirer";
import chalk from "chalk";

//modulos internos
import fs from "fs";

console.log("Iniciamos o Accounts");

function operation(){
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'action',
                message: 'o que você deseja fazer?',
                choices: ['criar conta','consultar saldo','Depositar', 'Sacar', 'Sair'],
            },
        ]
    ).then((answer)=>{
        const action = answer['action']
        if(action === 'criar conta'){
            createAccount();
            buildAccount();
        }
          
    }).catch((err)=>console.log(err))
}
operation();

function createAccount(){
    console.log(chalk.bgGreen.black('Parabens por escolher nosso banco'));
    console.log(chalk.green('Defina as opções da sua conta a seguir'))
}

function buildAccount(){
    inquirer.prompt([{
        name: 'nameAccount',
        message: 'Qual o nome da conta?',
    }]).then((answer)=>{
        const accountName = answer['nameAccount']
        console.log("o nome da conta é "+accountName);
        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }
        if(fs.existsSync('accounts/'+accountName+'.json')){
            console.log(chalk.bgRed.black("Esta conta já existe, escolha outra conta"))
         buildAccount();
        }
        fs.writeFileSync('accounts/'+accountName+'.json','{"balance": 0}',function(err){
            console.log(err);
        })
        console.log(chalk.green("parabens, a sua conta foi criada!!"))
        
    }).catch((err)=>{console.log(err)})
}