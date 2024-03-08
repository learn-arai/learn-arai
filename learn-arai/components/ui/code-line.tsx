export default function CodeLine( {content } : { content : string } ) {
  return (
    <p className="px-2 bg-primary text-white rounded-sm">
      {content}
    </p>
  )
}