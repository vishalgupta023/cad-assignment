type Props = {
    coordinates: {
        bounds: {
            max: { x: number, y: number },
            min: { x: number, y: number }
        },
        center: {
            x: number,
            y: number
        }
    }
}

export default function GetCoordinates({ coordinates }: Props) {
    return (
        <div className="overflow-hidden shadow-md rounded-lg">
            {coordinates.bounds ? (
                <table className="min-w-full bg-white border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                            <th className="py-3 px-6 text-left border-b border-gray-200">Index</th>
                            <th className="py-3 px-6 text-left border-b border-gray-200">X</th>
                            <th className="py-3 px-6 text-left border-b border-gray-200">Y</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="py-3 px-6 border-b border-gray-200 font-medium">Max</td>
                            <td className="py-3 px-6 border-b border-gray-200 font-mono">
                                {coordinates.bounds.max.x}
                            </td>
                            <td className="py-3 px-6 border-b border-gray-200 font-mono">
                                {coordinates.bounds.max.y}
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="py-3 px-6 border-b border-gray-200 font-medium">Min</td>
                            <td className="py-3 px-6 border-b border-gray-200 font-mono">
                                {coordinates.bounds.min.x}
                            </td>
                            <td className="py-3 px-6 border-b border-gray-200 font-mono">
                                {coordinates.bounds.min.y}
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="py-3 px-6 font-medium">Center</td>
                            <td className="py-3 px-6 font-mono">
                                {coordinates.center.x.toFixed(2)}
                            </td>
                            <td className="py-3 px-6 font-mono">
                                {coordinates.center.y}
                            </td>
                        </tr>
                    </tbody>
                </table>) : "-"}

        </div>
    )
}