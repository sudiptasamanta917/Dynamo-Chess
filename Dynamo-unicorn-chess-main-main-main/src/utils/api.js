import axios from 'axios';
import { toastError, toastWarn } from './notifyCustom';

export const getApi = async (url) => {
    try {
        const response = await axios.get(
            url,
        )
        return response
    } catch (error) {
        return error;
    }
}

export const getApiWithToken = async (url,) => {
    // console.log(url);
    const token = localStorage.getItem('chess-user-token')
    console.log(token,"ttttttt ");
    
    try {
        const response = await axios(url, {
            method: "GET",
            headers: {
                Authorization: JSON.parse(token),
                "Content-Type": "application/json",
            },
        });
        return response; // Return response data

    } catch (error) {
        // toastError(error .response.data.message)
        return error;
    }
};


// export const getApiWithToken = async (url) => {
//     const token = localStorage.getItem('chess-user-token');
//     try {
//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Plain string expected
//           "Content-Type": "application/json",
//         },
//       });
//       return response;
//     } catch (error) {
//       console.error("API error:", error.response?.data || error.message);
//       throw error; // so react-query knows it failed
//     }
//   };
  

export const deleteApiWithToken = async (url,) => {
    // console.log(url);
    const token = localStorage.getItem('chess-user-token')
    try {
        const response = await axios(url, {
            method: "get",
            headers: {
                Authorization: JSON.parse(token),
                "Content-Type": "application/json",
            },
        });
        return response; // Return response data

    } catch (error) {
        // toastError(error.response.data.message)
        return error;
    }
};

export const postApi = async (url) => {
    try {
        const token = localStorage.getItem('chess-user-token');
        const response = await axios(url, {
            method: "POST",
            headers: {
                Authorization: JSON.parse(token),
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (error) {
        let message = 'An unexpected error occurred';
        

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message = 'Unauthorized access. Please log in again.';
                    break;
                case 404:
                    message = 'Tournament not found.';
                    break;
                // case 400:
                //     message = 'Tournament not found.';
                //     break;
                // Add other specific cases as needed
                default:
                    message = error.response.data.message;
            }
        }

        return error.response
    }
};


export const postNoDataWithTokenApi = async (url) => {
    // console.log("pppppppppppppp", url);
    try {
        const token = localStorage.getItem('chess-user-token');
        const response = await axios(url, {
            method: "POST",
            headers: {
                Authorization: JSON.parse(token),
                "Content-Type": "application/json",
            },
        });
        // console.log(response, "kkkkkkeeeeee");
        return response; // Return the response here
    } catch (error) {
        // toastError(error.response.data.message)
        return error;
    }
};
export const postApiWithToken = async (url, formData) => {


    let data = JSON.stringify(formData);

    try {
        const token = localStorage.getItem('chess-user-token')
        const response = await axios(url, {
            method: "POST",
            headers: {
                Authorization: JSON.parse(token),
                "Content-Type": "application/json",
            },
            data: data
        })
        return response;

    } catch (error) {
        // console.log(error.response.data.message);
        toastError(error.response.data.message)
        return error;
    }

}
export const postApiWithFormdata = async (url, formData) => {


    let data = JSON.stringify(formData);

    try {
        const response = await axios(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: data
        })
        return response

    } catch (error) {
        // console.log(error);
        toastError(error.response.data.message)
        return error.response;
    }

}


export const postApiWithTokenRowData = async (url, formData) => {

// console.log(formData,url,"------");

    let data = JSON.stringify(formData);

    try {
        // const token = localStorage.getItem('chess-user-token')
        const response = await axios(url, {
            method: "POST",
            headers: {
                "Authorization": JSON.parse(localStorage.getItem("chess-user-token")),
                "Content-Type": "application/json",
            },
            data: data
        })
        return response;

    } catch (error) {
        // console.log(error.response.data.message);
        toastError(error.response.data.message)
        return error;
    }

}