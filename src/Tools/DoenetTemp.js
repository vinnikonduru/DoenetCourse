import React, { useState, useCallback, useEffect, useRef, } from "react";
import {
  useQuery,
  useQueryCache,
  QueryCache,
  ReactQueryCacheProvider,
  useMutation,
  QueryClient,
  QueryClientProvider ,
  useInfiniteQuery,
  useQueryClient
} from 'react-query'
import axios from "axios";
// import { ReactQueryDevtools } from 'react-query-devtools'
import { ReactQueryDevtools } from 'react-query/devtools'

import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import Tool from "../imports/Tool/Tool";
import 'regenerator-runtime/runtime'


const queryClient = new QueryClient();

export default function App(){

return(
  <>
     <QueryClientProvider client={queryClient} >
  
        <ToolExample/>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right"/>

      </QueryClientProvider >
      </>
    )
  
}



 const fetchFiles = async(label)=>{
    // const phpUrl = "/api/queryTest.php?pageSize=1";
    // const phpUrl = `/api/queryTest.php?label=${label}`;
    // const phpUrl = `/api/queryTest.php?label=${label}`

    // useEffect(() => {
      // const { data } = await axios.get(phpUrl);
      // console.log("Inside fetch", data);

      const { data } = await axios.get("/api/queryTest.php");

      return data;
    // }, []);

  }

  
function AddFiles(props) {
  const queryCache = useQueryClient();
  const inputRef = React.createRef();
  const [labelTxt,setLabelText] = useState("");
  // const [userInput,setUserInput] = useState('');
  const addFiles = async (obj)=>{
    const { data } = await axios.get("/api/queryTest.php?userInput="+ JSON.stringify({id: obj.id,label: labelTxt}));
    

    // const { data } = await axios.get("/api/queryTest.php",payload = {
    //   params: data
    // });

    

        // axios.post(`/api/queryTest.php`, data).then(response => {

        //   resolve(response.data);

        // }).catch(error => {

        //   logger.error(`Error: ${error}`);

        //   reject(error);

        // });

  }
  const {mutateAsync} = useMutation(addFiles, {
    onSuccess: () => queryCache.invalidateQueries("files")
  })
  const onAdd = () => {
    // console.log(mutateAsync);
    mutateAsync({id: inputRef.current.value})
    inputRef.current.value = ""
  }

  const labelOnChange = (e) => {
    setLabelText(e.target.value);
  }
  return (
    <>
      <input ref={inputRef}/>
      <input type="text" value = {labelTxt} onChange={labelOnChange}/>
      <button onClick={onAdd}>Add Files</button>

    </>
  )
}


export function ToolExample(props){

//   const {
//   data,
//   error,
//   isLoading,
//   isError,
//   canFetchMore,
//   fetchMore,
//   isFetchingMore,
// } = useInfiniteQuery("files", fetchFiles, {
//   getFetchMore: (lastGroup) => lastGroup.offset,
// });


// console.log(">>>data", data);

  const {
    data,error,isLoading,isError
  } = useQuery("files" ,fetchFiles, {});

  // const [folderData, setFolder] = useState(data);

  if(isLoading){
    return <div>Loading....</div>;
  }
  if(isError) {
    return <div>{JSON.stringify(error)}</div>;
  }
  

const onDelete = (id) => {
  axios.get('/api/deleteQuery.php', {
    params: {
      id:id
    }
  })
  .then(function (response) {
      setFolder(response.records)
    // console.log(response);
  })
      


  
        // axios.request({
        //   method: 'POST',
        //   url: `http://localhost:4444/next/api`,
        //   headers: {
        //     'Authorization': token
        //   },
        //   data: {
        //     next_swastik: 'lets add something here'
        //   },
        
        // })

  // return (
  //   <div>Test delete</div>
  // )
   
}
  //if(data) {
      return (
        <div>
          React Query Test
          <AddFiles/>
          {/* <DeleteFiles /> */}
          <ul>
           {data && data.records.map(obj=> (
          // {folderData && folderData.records.map(obj=> (

            <>
            <li>{obj.id},{obj.label}
            {/* <a href="" on > X</a> */}
            <button onClick={() => onDelete(obj.id)}>X</button>
            </li>
            
            </>
          ))}
{/* 
{data && data.pages[0] && data.pages[0].records && data.pages[0].records.map(obj=> (
            <>
            <li>{obj.id},{obj.label}</li>
            </>
          ))} */}
          </ul>
          <div>
        {/* <button
          onClick={() => fetchMore()}
          disabled={!canFetchMore || isFetchingMore}
        >
          {isFetchingMore
            ? "Loading more..."
            : canFetchMore
            ? "Load more"
            : "Nothing to load"}
        </button> */}
      </div>
        </div>
      )
  //}

// return(
//   <div>
//     React query
    
//   </div>
// )
}



// const getProducts = function(){
//   return new Promise(function(resolve, reject){
//     setTimeout(() => {
//       resolve(Products)
//     }, 1000)
//   })
// }
// const queryCache = new QueryCache();
// export default function App(){
//   return (
//     <ReactQueryCacheProvider queryCache={queryCache}>
//       <Tool/>
//    </ReactQueryCacheProvider>
//   )
// }
//  export function Tool(){
 

//   const {data, error , isFetching } = useQuery('products', getProducts);

//   // useQuery('products', () => fetch('/api/products'.then(r=>r.json()))

//   return(
//     <div className="App">

//       {isFetching && <p>Fetching ...</p>
//       }

//       {error!==null && 
//       <p>{error.message}</p>
//       }
//       {data !== undefined && 
//       <ul>
//         {data.map(x=>(
//           <li key={x.id}>{x.name}</li>
//         ))}
//         </ul>}
//     </div>
//   )
// }