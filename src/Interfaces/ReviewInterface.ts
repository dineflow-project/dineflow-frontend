
  export interface Review {
    _id?: string; // Assuming _id is a string in JSON
    score: number;
    description: string;
    timestamp?: string; // Make sure to adjust this according to your API response
    vendor_id: string;
    user_id?: string;
  } 

//   {
//     "_id": "6551e09af18caac6e2a29da5",
//     "score": 1,
//     "description": "good",
//     "timestamp": "2023-11-13T08:38:50.521Z",
//     "vendor_id": "1",
//     "user_id": "6551d7e4d1b734dc2589d379"
// }