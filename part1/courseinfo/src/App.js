const Header = (props) => {
  return (
    <div>
      <h1>{props.course.courseName}</h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part part={props.course.courseParts[0]} />
      <Part part={props.course.courseParts[1]} />
      <Part part={props.course.courseParts[2]} />
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>
        Number of exercises {props.course.courseParts.reduce((partialSum, a) => partialSum + a.exercises, 0)}
      </p>
    </div>
  )
}

const App = () => {
  const oCourse = {
    courseName: 'Half Stack application development',
    courseParts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={oCourse} />
      <Content course={oCourse} />
      <Total course={oCourse} />
    </div>
  )
}

export default App