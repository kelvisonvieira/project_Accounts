

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
             consultAccount();
        }else if(action==='Depositar'){
                  deposit();
        }else if(action ==='Sacar'){
           withdraw()
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
      
        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }
        if(fs.existsSync('accounts/'+accountName+'.json')){
            console.log(chalk.bgRed.black("Esta conta já existe, escolha outra conta"))
         buildAccount();
        }else{
        fs.writeFileSync('accounts/'+accountName+'.json','{"balance": 0}',function(err){
            console.log(err);
           
        })
        console.log(chalk.green("parabens, a sua conta foi criada!!"))
    }
       
        
        
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
console.log(chalk.bgGreen.black('foi depositado '+account.balance+" na sua conta"))
operation();
}
function getAccount(accountName){
 const accountJSON = fs.readFileSync('accounts/'+accountName+'.json',{encoding:'utf-8',flag:'r'})
return JSON.parse(accountJSON)
}

function consultAccount(){
    inquirer.prompt([
        {
            name:'nameAccount',
            message:'Qual o nome da conta?'
        }
        
    ]).then((answer)=>{
        const resp = answer['nameAccount']
        if(checkAccount(resp)){
         const accountData = getAccount(resp);
         console.log(chalk.bgBlue.black("Olá, seu saldo é de :"+accountData.balance))
        }
        operation()
    }).catch((err)=>{
        console.log(err);
    })
}

function withdraw(){
    inquirer.prompt([{
         name:'nameAccount',
         message:'Qual o nome da conta?',  
        }
    ]).then((answer)=>{
         const nameAccount= answer['nameAccount'];
         if(checkAccount(nameAccount)){
            inquirer.prompt([{
                name:'amount',
                message:'Quanto deseja sacar?',
            }]).then((answer)=>{
                const amount = answer['amount'];
               removeAmount(nameAccount,amount)
  
            }).catch()
         }else{
            withdraw();
         }
        
    }).catch()
}
function removeAmount(nameAccount,amount){
 const accountData = getAccount(nameAccount)
 if(!amount){
    console.log(chalk.bgRed.black('ocorreu um erro, tente novamente mais tarde'))
    return withdraw() 
}
if(accountData.balance <amount){
    console.log(chalk.bgRed.black("Saldo insuficiente"))
    return withdraw()
}
accountData.balance=parseFloat(accountData.balance)-parseFloat(amount);
fs.writeFileSync('accounts/'+nameAccount+'.json',JSON.stringify(accountData))
console.log(chalk.bgGreen.black('foi sacado '+amount+" da sua conta"))
operation();
}