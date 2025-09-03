'use client'
import React, { useEffect, useState, useRef } from 'react';

const InfiniteScrollTodos = () => {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const LIMIT = 20; // Simulate pagination

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await res.json();
      const nextItems = data.slice((page - 1) * LIMIT, page * LIMIT);

      setTodos((prev) => [...prev, ...nextItems]);
      setHasMore(page * LIMIT < data.length);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [page]);

  // Infinite scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loaderRef.current, hasMore, loading]);

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
      <h2>Infinite Scroll Todos</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: '1rem' }}>
            <strong>#{todo.id}</strong>: {todo.title}
          </li>
        ))}
      </ul>

      {loading && <p>Loading more todos...</p>}
      {!hasMore && <p>No more todos to load.</p>}
      <div ref={loaderRef} style={{ height: '1px' }}></div>
    </div>
  );
};

export default InfiniteScrollTodos;
