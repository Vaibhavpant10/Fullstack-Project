// import { useState } from "react";

// export default function App() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [notes, setNotes] = useState([]);


//   const handleLogin = async () => {
//     const res = await fetch("http://localhost:3000/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },

//       body: JSON.stringify({ email, password })
//     });

//     const data = await res.json();
//     console.log("LOGIN RESPONSE:", data);

//     localStorage.setItem("token", data.token);
//     alert("Login success!");
//   };

//   const addNote = async () => {
//   const token = localStorage.getItem("token");

//   await fetch("http://localhost:3000/add-note", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       authorization: token
//     },
//     body: JSON.stringify({
//       title: "Frontend Note",
//       content: "Connected!",
//       userId: "PUT_USER_ID"
//     })
//   });

//   alert("Note added");
// };


//  const getNotes = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const userId = "PUT_USER_ID_HERE";

//     const res = await fetch(`http://localhost:3000/notes/${userId}`, {
//       headers: {
//         authorization: token
//       }
//     });

//     const data = await res.json();
//     console.log("TOKEN:", token);


//     console.log("NOTES:", data); // 👈 debug

//     setNotes(Array.isArray(data) ? data : []);

//   } catch (err) {
//     console.log(err);
//   }
// };





//   return (
//     <div className="h-screen flex flex-col items-center justify-center gap-4">
//       <input
//         className="border p-2"
//         placeholder="Email"
//         onChange={e => setEmail(e.target.value)}
//       />

//       <input
//         className="border p-2"
//         placeholder="Password"
//         type="password"
//         onChange={e => setPassword(e.target.value)}
//       />

//       <button
//         className="bg-blue-500 text-white px-4 py-2"
//         onClick={handleLogin}
//       >
//         Login
//       </button>

//         {/* 🔥 BUTTON FOR ADD NOTE */}
//       <button
//         className="bg-green-500 text-white px-4 py-2"
//         onClick={addNote}
//       >
//         Add Note
//       </button>

//       <button
//         className="bg-purple-500 text-white px-4 py-2"
//         onClick={getNotes}
//       >
//         Get Notes
//       </button>

//      <div className="mt-6 w-80 space-y-3">
//       {Array.isArray(notes) &&
//         notes.map((note, index) => (
//           <div key={index} className="border p-3 rounded shadow">
//             <h2 className="font-bold">{note.title}</h2>
//             <p>{note.content}</p>
//           </div>
//         ))}
//      </div>



//     </div>
//   );
// }


import { useState } from "react";

export default function App() {
  // =========================
  // STATES
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState([]);

  // ⚠️ put your REAL MongoDB user _id here
  const userId = "6989bd76e899abbcf23cb995";


  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    try {
      const res = await fetch("https://fullstack-project-add-notes.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      console.log("LOGIN:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful ✅");
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.log(err);
    }
  };


  // =========================
  // ADD NOTE
  // =========================
  const addNote = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://fullstack-project-add-notes.onrender.com/add-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token
        },
        body: JSON.stringify({
          title: "New Note",
          content: "Added from React",
          userId
        })
      });

      const data = await res.json();
      console.log("ADD NOTE:", data);

      alert("Note added ✅");

    } catch (err) {
      console.log(err);
    }
  };


  // =========================
  // GET NOTES
  // =========================
  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://fullstack-project-add-notes.onrender.com/notes/${userId}`,
        {
          headers: {
            authorization: token
          }
        }
      );

      const data = await res.json();

      console.log("NOTES:", data);

      // 🔥 SAFE (prevents crash)
      setNotes(Array.isArray(data) ? data : []);

    } catch (err) {
      console.log(err);
    }
  };
//delete..

  const deleteNote = async (id) => {
  const token = localStorage.getItem("token");

  await fetch(`https://fullstack-project-add-notes.onrender.com/delete-note/${id}`, {
    method: "DELETE",
    headers: {
      authorization: token
    }
  });

  getNotes(); // 🔥 refresh list automatically
};

// edit

const editNote = async (id) => {
  const newTitle = prompt("Enter new title");
  const newContent = prompt("Enter new content");

  const token = localStorage.getItem("token");

  await fetch(`https://fullstack-project-add-notes.onrender.com/update-note/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify({
      title: newTitle,
      content: newContent
    })
  });

  getNotes(); // refresh
};






  // =========================
  // UI
  // =========================
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">

      <h1 className="text-2xl font-bold">Notes App</h1>

      <input
        className="border p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={handleLogin}
      >
        Login
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={addNote}
      >
        Add Note
      </button>

      <button
        className="bg-purple-500 text-white px-4 py-2"
        onClick={getNotes}
      >
        Get Notes
      </button>


      {/* =========================
          NOTES LIST (SAFE MAP)
         ========================= */}
      <div className="mt-6 w-80 space-y-2">

        {Array.isArray(notes) && notes.length === 0 && (
          <p>No notes yet</p>
        )}

        {Array.isArray(notes) &&
          notes.map((note) => (
            <div key={note._id} className="border p-3 rounded shadow">

              <h3 className="font-bold">{note.title}</h3>
              <p>{note.content}</p>

              <div className="flex gap-2 mt-2">

                <button
                  className="bg-yellow-500 text-white px-2"
                  onClick={() => editNote(note._id)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-500 text-white px-2"
                  onClick={() => deleteNote(note._id)}
                >
                  Delete
                </button>

              </div>

             </div>
          ))}

      </div>

    </div>
  );
}
