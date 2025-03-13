from pika import BlockingConnection, ConnectionParameters, PlainCredentials

class RabbitMQService:
    def __init__(self, host, port, username, password):
        self.credentials = PlainCredentials(username, password)
        self.connection_params = ConnectionParameters(host=host, port=port, credentials=self.credentials)
        self.connection = BlockingConnection(self.connection_params)
        self.channel = self.connection.channel()

    def publish(self, queue, message):
        self.channel.queue_declare(queue=queue, durable=True)
        self.channel.basic_publish(exchange='', routing_key=queue, body=message, properties=None)

    def consume(self, queue, callback):
        self.channel.queue_declare(queue=queue, durable=True)

        def on_message(ch, method, properties, body):
            callback(body)
            ch.basic_ack(delivery_tag=method.delivery_tag)

        self.channel.basic_consume(queue=queue, on_message_callback=on_message)
        self.channel.start_consuming()

    def close(self):
        self.connection.close()