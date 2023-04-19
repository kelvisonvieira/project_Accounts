

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
        }else if(action ==='consultar saldo'){

        }else if(action==='Depositar'){
                  deposit();
        }else if(action ==='Sacar'){

        }else if(action==='Sair'){
          console.log(chalk.bgBlue.black("Obrigado por usar o Account!!"))
          process.exit();
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
        buildAccount();
        
    }).catch((err)=>{console.log(err)})



}
//add an amount to user account
 function deposit(){
    inquirer.prompt([
        {
            name:'nameAccount',
            message: 'qual o nome da sua conta?',
        }
    ]).then((answer)=>{
        const resp= answer['nameAccount'];
        if(checkAccount(resp)){
         inquirer.prompt([{
            name:'amountAccount',
            message:'quanto deseja depositar',
         }]).then((answer)=>{
             const amountAccount= answer['amountAccount'];
             addAmount(resp,amountAccount);


         }).catch((err)=>console.log(err))
        }else{
            deposit();
        }
     
    }).catch((err)=>{
        console.log(err);
    })
 }


 //account verification
function checkAccount(resp){
    if(!fs.existsSync('accounts/'+resp+'.json')){
        console.log("essa conta não existe!")
        return false
    }
 
    return true
}


function addAmount(accountName, amount){
const account =getAccount(accountName)
if(!amount){
    console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'));
    return deposit();
}
account.balance =parseFloat(amount)+parseFloat(account.balance);
fs.writeFileSync('accounts/'+accountName+'.json',JSON.stringify(account))
console.log(chalk.bgGreen.black('foi depositado '+amount+" na sua conta"))
operation();
}
function getAccount(accountName){
 const accountJSON = fs.readFileSync('accounts/'+accountName+'.json',{encoding:'utf-8',flag:'r'})
return JSON.parse(accountJSON)
}