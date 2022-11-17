import * as Web3 from '@solana/web3.js'
import Dotenv from 'dotenv'
Dotenv.config()

async function main() {
    const payer = initializeKeypair()
    const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'))
    await connection.requestAirdrop(payer.publicKey, Web3.LAMPORTS_PER_SOL*1)
    await sendSol(connection, 0.1*Web3.LAMPORTS_PER_SOL, Web3.Keypair.generate().publicKey, payer)
}

function initializeKeypair(): Web3.Keypair {
    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    const keypairFromSecretKey = Web3.Keypair.fromSecretKey(secretKey)
    return keypairFromSecretKey
}

async function sendSol(connection: Web3.Connection, amount: number, to: Web3.PublicKey, sender: Web3.Keypair) {
    const transaction = new Web3.Transaction()

    const sendSolInstruction = Web3.SystemProgram.transfer(
        {
            fromPubkey: sender.publicKey,
            toPubkey: to, 
            lamports: amount,
        }
    )

    transaction.add(sendSolInstruction)

    const sig = await Web3.sendAndConfirmTransaction(connection, transaction, [sender])
    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

main().then(() => {
    console.log("Finished successfully")
}).catch((error) => {
    console.error(error);
})
