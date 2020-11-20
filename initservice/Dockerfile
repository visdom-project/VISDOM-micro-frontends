FROM alpine:latest
RUN apk --no-cache add curl bash
RUN addgroup -S inituser && adduser -S -G inituser inituser 
RUN mkdir /bootstrap
COPY ./*.sh /bootstrap/
RUN chown -R inituser:inituser /bootstrap && chmod +x /bootstrap/*.sh
USER inituser