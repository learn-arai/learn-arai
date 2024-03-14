
export default function List() {
    const teacher_list = [{
        name: 'peerasin',
        surname: 'srisri'
    },
    {
        name: 'mok',
        surname: 'maraard'
    }]
    const student_list = []
    return (
        <div className="flex flex-col gap-2 w-full">
            <h2>Teacher</h2>
            {teacher_list.map(function (data) {
                return (
                    <div className="flex flex-row gap-2 border-4">
                        <div>
                            {data.name}
                        </div>
                        <div>
                            {data.surname}
                        </div>
                    </div>
                )
            })}
        </div>
    )

}