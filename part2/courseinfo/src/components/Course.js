const Header = ({ course }) => <h2>{course.name}</h2>

const Total = ({ sum }) => <h3>total of {sum} exercises</h3>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </>

const Course = ({ course }) => {
  const sum = course.parts.reduce(
    (accumulator, part) => accumulator + part.exercises, 0
  )
  return (
    <>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total sum={sum} />
    </>
  )
}

export default Course