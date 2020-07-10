FROM golang:1.13.10-alpine3.10 as builder

# Install git + SSL ca certificates.
# Git is required for fetching the dependencies.
# Ca-certificates is required to call HTTPS endpoints.
RUN apk update && apk add --no-cache git ca-certificates && update-ca-certificates


RUN go get github.com/google/uuid
RUN go get github.com/pkg/errors
RUN go get github.com/sirupsen/logrus
RUN go get github.com/prometheus/common/log
RUN go get github.com/gorilla/handlers
RUN go get github.com/go-sql-driver/mysql
COPY . ./

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix nocgo -o main

FROM alpine:3.9

COPY --from=builder ./go/main .

ENTRYPOINT ["./main"]
