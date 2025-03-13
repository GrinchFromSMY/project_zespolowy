import React, { useEffect, useState } from 'react';
import ExampleComponent from '../components/ExampleComponent';
import { fetchExampleData } from '../services/api';

const ExamplePage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const result = await fetchExampleData();
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <div>
            <h1>Пример страницы</h1>
            {data && <ExampleComponent data={data} />}
        </div>
    );
};

export default ExamplePage;