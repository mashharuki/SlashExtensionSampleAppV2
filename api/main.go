package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/joho/godotenv"
	"io/ioutil"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

/**
 * 乱数列を生成するメソッド
 */
func generateCode() string {
	// 生成する文字列の候補
	candidates := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

	// 文字列の長さ
	length := 10

	// 現在時刻からシード値を生成する
	rand.Seed(time.Now().UnixNano())

	// ランダムな文字列を生成する
	result := make([]byte, length)
	for i := range result {
		result[i] = candidates[rand.Intn(len(candidates))]
	}

	return string(result)
}

/**
 * APIサーバーのmainファイル
 */
func main() {
	r := gin.Default()

	err := godotenv.Load(".env")
	if err != nil {
		fmt.Printf("failed to load .env file: %v", err)
	}

	/**
	 * テスト用API
	 */
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	/**
	 * Slashの決済用のURLを生成するAPI
	 */
	r.POST("/getUrl", func(c *gin.Context) {
		// api-endpoint
		API_ENDPOINT := "https://testnet.slash.fi/api/v1/payment/receive"
		// Authentication Token
		AUTH_TOKEN := os.Getenv("SLASH_AUTH_TOKEN")
		// Hash Token
		HASH_TOKEN := os.Getenv("SLASH_HASH_TOKEN")

		// Code set by the merchant to uniquely identify the payment
		// 本来はDBベースに保管しておく必要がある。
		ORDER_CODE := generateCode()
		// 確認のため出力
		fmt.Printf("AUTH_TOKEN: %s\n", AUTH_TOKEN)
		fmt.Printf("HASH_TOKEN: %s\n", HASH_TOKEN)
		fmt.Printf("ORDER_CODE: %s\n", ORDER_CODE)

		// Set amount and Generate verify token
		// this number must be Zero or more
		amount_to_be_charged := c.PostForm("amount")
		raw := fmt.Sprintf("%s::%f::%s", ORDER_CODE, amount_to_be_charged, HASH_TOKEN)
		verify_token := sha256.Sum256([]byte(raw))

		// data to be sent to api
		data := url.Values{}
		data.Add("identification_token", AUTH_TOKEN)
		data.Add("order_code", ORDER_CODE)
		data.Add("verify_token", hex.EncodeToString(verify_token[:]))
		data.Add("amount", amount_to_be_charged)
		data.Add("amount_type", "JPY")
		data.Add("ext_description", "This is payment for NFT")
		data.Add("ext_reserved", "0x")

		// sending post request and saving response as response object
		res, _ := http.PostForm(API_ENDPOINT, data)
		defer res.Body.Close()

		body, _ := ioutil.ReadAll(res.Body)

		fmt.Printf("url: %s\n", body)

		var responseObj interface{}
		_ = json.Unmarshal(body, &responseObj)

		url := responseObj.(map[string]interface{})["url"]

		if url != nil {
			fmt.Printf("url: %s\n", url)
		} else {
			err := responseObj.(map[string]interface{})["errors"]
			fmt.Println(err)
		}

		c.JSON(200, gin.H{
			"url": url,
		})
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run()
}
