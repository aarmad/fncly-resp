<!DOCTYPE html>
<html>

<head>
    <title>Financial Report</title>
    <style>
        body {
            font-family: sans-serif;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .section {
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Monthly Report</h1>
        <p>Generated for {{ $user->name }}</p>
    </div>

    <div class="section">
        <h2>Summary</h2>
        <p>Balance: {{ number_format($data['balance'], 2) }} €</p>
        <p>Total Income: {{ number_format($data['income'], 2) }} €</p>
        <p>Total Expense: {{ number_format($data['expense'], 2) }} €</p>
    </div>

    <div class="section">
        <h2>Transactions</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Note</th>
                </tr>
            </thead>
            <tbody>
                @foreach($transactions as $t)
                    <tr>
                        <td>{{ $t->date->format('Y-m-d') }}</td>
                        <td>{{ $t->type }}</td>
                        <td>{{ number_format($t->amount, 2) }} €</td>
                        <td>{{ $t->category->name ?? '-' }}</td>
                        <td>{{ $t->note }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>

</html>