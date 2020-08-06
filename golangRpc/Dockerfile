FROM golang:1.13.10-alpine3.10 as builder

# Install git + SSL ca certificates.
# Git is required for fetching the dependencies.
# Ca-certificates is required to call HTTPS endpoints.
RUN apk update && apk add --no-cache git ca-certificates && update-ca-certificates

# Go get all required packages
RUN go get github.com/google/uuid
RUN go get github.com/pkg/errors
RUN go get github.com/sirupsen/logrus
RUN go get github.com/prometheus/common/log
RUN go get github.com/gorilla/handlers
RUN go get github.com/go-sql-driver/mysql
# load the directory which the Dockerfile is located in into the container.
COPY . ./
# combine the source code for a linux system and name the executable main
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix nocgo -o main
# create a new stage for production that is lightweight and small
FROM alpine:3.9
# go programs compile to binary, so we only need that file
COPY --from=builder ./go/main .
# execute the binary
ENTRYPOINT ["./main"]
