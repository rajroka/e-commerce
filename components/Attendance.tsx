"use client"
import { useState } from 'react';

const students = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

export default function AttendancePage() {
  // Attendance state: { studentId: 'present' | 'absent' }
  const [attendance, setAttendance] = useState<{ [key: number]: string }>({});

  function toggleAttendance(id: number, status: 'present' | 'absent') {
    setAttendance(prev => ({ ...prev, [id]: status }));
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Attendance System</h1>
      <table border={1} cellPadding={10} cellSpacing={0} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                <input
                  type="radio"
                  name={`attendance-${student.id}`}
                  checked={attendance[student.id] === 'present'}
                  onChange={() => toggleAttendance(student.id, 'present')}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`attendance-${student.id}`}
                  checked={attendance[student.id] === 'absent'}
                  onChange={() => toggleAttendance(student.id, 'absent')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Summary</h2>
      <p>Present: {Object.values(attendance).filter(v => v === 'present').length}</p>
      <p>Absent: {Object.values(attendance).filter(v => v === 'absent').length}</p>
    </div>
  );
}
