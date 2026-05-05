import {
  Tailwind,
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Column,
  Row,
  Text,
  Heading,
  Button,
  Hr,
} from "react-email";

interface EmailProps {
  fromName?: string;
  fromEmail?: string;
  toEmail?: string;
  subject?: string;
  content?: string;
  year?: number;
}

export const Email = ({
  fromName = "Usuario",
  fromEmail = "usuario@ejemplo.com",
  toEmail = "destinatario@ejemplo.com",
  subject = "Nuevo mensaje",
  content = "Este es el contenido del mensaje.",
  year = new Date().getFullYear(),
}: EmailProps) => {
  return (
    <Tailwind>
      <Html lang="es">
        <Head />
        <Preview>{`${fromName} te ha enviado un mensaje: ${subject}`}</Preview>
        <Body className="bg-neutral-100 font-sans">
          <Container className="bg-white mx-auto max-w-2xl">
            <Section className="bg-neutral-900 text-center">
              <Heading className="text-white text-3xl font-semibold m-0 pt-2">
                Nuevo mensaje
              </Heading>
              <Text className="text-neutral-400 text-sm m-0 pb-2">
                Enviado desde My App
              </Text>
            </Section>

            <Section className="flex flex-col items-center p-4 max-w-lg mx-auto">
              <Text className="text-base text-neutral-700 mb-5">Hola,</Text>
              <Text className="text-sm text-neutral-600 mb-6 leading-relaxed">
                Has recibido un nuevo mensaje de{" "}
                <strong className="text-neutral-900">{fromName}</strong>:
              </Text>

              <Section className="flex bg-neutral-50 rounded-lg p-2 mb-6 border border-neutral-200">
                <Row className="mb-3">
                  <Column className="w-16 align-top">
                    <Text className="text-xs font-semibold text-neutral-500 m-0 uppercase tracking-wide">
                      De:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-sm text-neutral-800 m-0 wrap-break-word">
                      {fromName} &lt;{fromEmail}&gt;
                    </Text>
                  </Column>
                </Row>
                <Row className="mb-3">
                  <Column className="w-16 align-top">
                    <Text className="text-xs font-semibold text-neutral-500 m-0 uppercase tracking-wide">
                      Para:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-sm text-neutral-800 m-0 wrap-break-word">
                      {toEmail}
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-16 align-top">
                    <Text className="text-xs font-semibold text-neutral-500 m-0 uppercase tracking-wide">
                      Asunto:
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-sm font-semibold text-neutral-800 m-0 wrap-break-word">
                      {subject}
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section className="flex bg-neutral-50 rounded-lg p-2 mb-6 border border-neutral-200">
                <Row>
                  <Text className="text-xs font-semibold text-neutral-500 m-0 uppercase tracking-wide">
                    Mensaje:
                  </Text>
                </Row>
                <Row>
                  <Text className="text-sm text-neutral-700 w-full">
                    {content}
                  </Text>
                </Row>
              </Section>

              <Section className="text-center mb-8">
                <a
                  href="https://proyecto.personal.castdevj.lat/"
                  className="bg-neutral-900 rounded-lg text-white text-sm font-medium no-underline text-center inline-block py-3 px-8 hover:bg-neutral-800 transition-colors"
                >
                  Responder ahora
                </a>
              </Section>

              <Hr className="border-neutral-200 my-8" />

              <Text className="text-neutral-400 text-xs text-center mb-2">
                Este correo fue enviado desde la aplicación My App &copy; {year}{" "}
                My App - Todos los derechos reservados
              </Text>
              <Text className="text-neutral-400 text-[10px] text-center mt-4">
                Si no esperabas este correo, puedes ignorarlo.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default Email;
