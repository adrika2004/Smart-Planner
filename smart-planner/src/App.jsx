import { useState, useEffect } from "react";

function App() {

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const [tasks, setTasks] = useState({});

  const [input, setInput] = useState("");

  const month = currentDate.getMonth();

  const year = currentDate.getFullYear();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  useEffect(() => {

    const savedTasks = JSON.parse(
      localStorage.getItem("plannerTasks")
    );

    if (savedTasks) {
      setTasks(savedTasks);
    }

  }, []);

  const saveTasks = (updatedTasks) => {

    localStorage.setItem(
      "plannerTasks",
      JSON.stringify(updatedTasks)
    );
  };

  const fullDateKey = `${selectedDate}-${month}-${year}`;

  const addTask = () => {

    if (!input.trim()) return;

    const updatedTasks = {

      ...tasks,

      [fullDateKey]: [

        ...(tasks[fullDateKey] || []),

        {
          text: input,
          completed: false,
        },
      ],
    };

    setTasks(updatedTasks);

    saveTasks(updatedTasks);

    setInput("");
  };

  const toggleTask = (index) => {

    const updated = [...tasks[fullDateKey]];

    updated[index].completed =
      !updated[index].completed;

    const updatedTasks = {
      ...tasks,
      [fullDateKey]: updated,
    };

    setTasks(updatedTasks);

    saveTasks(updatedTasks);
  };

  const deleteTask = (index) => {

    const updated =
      tasks[fullDateKey].filter(
        (_, i) => i !== index
      );

    const updatedTasks = {
      ...tasks,
      [fullDateKey]: updated,
    };

    setTasks(updatedTasks);

    saveTasks(updatedTasks);
  };

  const previousMonth = () => {

    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {

    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-8">

      {/* Heading */}

      <div className="text-center mb-10">

        <h1 className="text-5xl font-extrabold text-purple-800 mb-3">

          Smart Planner

        </h1>

        <p className="text-gray-700 text-lg">

          Organize your daily life beautifully ✨

        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* Calendar */}

        <div className="bg-white/40 backdrop-blur-xl rounded-[35px] p-8 shadow-2xl border border-white/30">

          {/* Spiral */}

          <div className="flex justify-center gap-6 mb-8">

            <div className="w-5 h-5 rounded-full bg-gray-600"></div>

            <div className="w-5 h-5 rounded-full bg-gray-600"></div>

            <div className="w-5 h-5 rounded-full bg-gray-600"></div>

          </div>

          {/* Month Controls */}

          <div className="flex justify-between items-center mb-8">

            <button
              onClick={previousMonth}

              className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
            >
              ←
            </button>

            <h2 className="text-4xl font-bold text-purple-700">

              {monthName} {year}

            </h2>

            <button
              onClick={nextMonth}

              className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
            >
              →
            </button>

          </div>

          {/* Week Days */}

          <div className="grid grid-cols-7 gap-3 mb-4">

            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => (

              <div
                key={day}
                className="text-center font-bold text-gray-700"
              >
                {day}
              </div>
            ))}

          </div>

          {/* Calendar Days */}

          <div className="grid grid-cols-7 gap-3">

            {[...Array(firstDay)].map((_, index) => (

              <div key={index}></div>

            ))}

            {[...Array(daysInMonth)].map((_, index) => {

              const day = index + 1;

              return (

                <button
                  key={day}

                  onClick={() => setSelectedDate(day)}

                  className={`
                    h-16 rounded-2xl font-bold text-lg
                    transition-all duration-300 shadow-md

                    ${
                      selectedDate === day
                        ? "bg-purple-700 text-white scale-105"
                        : day === today.getDate() &&
                          month === today.getMonth() &&
                          year === today.getFullYear()
                        ? "bg-pink-500 text-white"
                        : "bg-white/70 hover:bg-purple-200"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Todo Section */}

        <div className="bg-white/40 backdrop-blur-xl rounded-[35px] p-8 shadow-2xl border border-white/30">

          <h2 className="text-3xl font-bold text-purple-700 mb-6">

            Tasks for {selectedDate} {monthName} {year}

          </h2>

          {/* Input */}

          <div className="flex gap-4 mb-8">

            <input
              type="text"

              placeholder="Enter your task..."

              value={input}

              onChange={(e) => setInput(e.target.value)}

              className="
                flex-1
                p-4
                rounded-2xl
                outline-none
                bg-white
                shadow-md
                text-lg
              "
            />

            <button
              onClick={addTask}

              className="
                bg-purple-700
                hover:bg-purple-800
                transition
                text-white
                px-6
                rounded-2xl
                font-bold
                shadow-lg
              "
            >
              Add
            </button>

          </div>

          {/* Tasks */}

          <div className="space-y-4">

            {(tasks[fullDateKey] || []).map((task, index) => (

              <div
                key={index}

                className="
                  bg-white
                  rounded-2xl
                  p-4
                  flex
                  justify-between
                  items-center
                  shadow-md
                "
              >

                <div
                  onClick={() => toggleTask(index)}

                  className={`
                    cursor-pointer
                    text-lg

                    ${
                      task.completed
                        ? "line-through text-green-600"
                        : "text-gray-800"
                    }
                  `}
                >
                  {task.text}
                </div>

                <button
                  onClick={() => deleteTask(index)}

                  className="
                    bg-red-500
                    hover:bg-red-600
                    transition
                    text-white
                    px-4
                    py-2
                    rounded-xl
                  "
                >
                  Delete
                </button>

              </div>
            ))}

            {(tasks[fullDateKey] || []).length === 0 && (

              <div className="text-center text-gray-600 text-lg mt-10">

                No tasks for this date 📅

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;