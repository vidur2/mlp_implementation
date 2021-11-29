import styles from "../styles/Home.module.css"
import Head from "next/head"

async function getMetadataStore(file){
    const res = await fetch('https://api.nft.storage/upload',{
          body: file,
          headers: {
            "Authorization": "Bearer " + process.env.nft_store_api_key
          },
          method: 'POST',
        })
    return res.json()
}

export default function Train(){
    const parse_csv = async(event) =>{
        event.preventDefault();
        const file = event.target.file_input.files[0];
        const formBody = new URLSearchParams;
        getMetadataStore(file).then((value) => {
            console.log('https://ipfs.io/ipfs/' + value.value.cid)
            formBody.append("metadata_url", value.value.cid)
            fetch ("https://mlp-api.app.vtxhub.com/", {
                method: "POST",
                body: formBody
            })
        })
      }

    return(
        <div className={styles.container}>
            <Head>
                <title>Training Page</title>
            </Head>
            <main className = {styles.main}>
                <form onSubmit={parse_csv}>
                    <input type="file" name="file_input"></input>
                    <button type="submit">Submit</button>
                </form>
            </main>
        </div>
    )
}