import styles from "../styles/Home.module.css"
import Head from "next/head"


export default function Train(){
    const parse_csv = async(event) =>{
    event.preventDefault();
    const file = event.target.file_input.files[0];
    const file_reader = new FileReader;
    file_reader.readAsText(file);
    file_reader.onload = async function(result) { 
        event.preventDefault();
        let string_result = result.target.result.toString();
        const split_result = string_result.split("\n")
        split_result.splice(0, 1);
        let current_array;
        let ctr;
        for (let i = 0; i < split_result.length; i += 18182){
            current_array = split_result.slice(i, i + 18181)
            current_array = current_array.join("\n")
            await fetch("/api/train_api", {
                method: "PUT",
                body: JSON.stringify({
                    csv_string: current_array
                })
            })
            ctr = i;
        }

        const resp = await fetch ("/api/train_api", {
            method: "POST"
        })
        console.log(await resp.text())
        // window.location.reload()
      }

    }
    return(
        <form onSubmit={parse_csv}>
            <input type="file" name="file_input"></input>
            <button type="submit">Submit</button>
        </form>
    )
}